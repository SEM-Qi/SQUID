#!/usr/bin/env python

import errno
import socket
import sys
import json
from time

mpstate = None



from MAVProxy.modules.lib import mp_module



class Testmod(mp_module.MPModule):
    def __init__(self, mpstate):
        super(Testmod, self).__init__(mpstate, "testmod", "mod that tests")
        self.add_command('stop', self.cmd_stop, "stop server", ['try again to stop server'])
        
        #Begin arming sequence
        self.timeStart
        self.timeEnd
        self.arm()
        self.squidArmed = True
        
        #Establish socket parameters
        self.outSock_address = ('127.0.0.1', 8425)
        self.outSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.outSock.setblocking(0)
        self.inSock_address = ('127.0.0.1', 8424)
        self.inSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        
        #Initialise variables to store incoming strings from controller
        self.currentVal = '1500:1500:1100:1500'
        self.oldVal = '1500:1500:1100:1500'
        self.currentMode = 'stabilize'
        
    #Looping task called by MAVProxy when loaded
    def idle_task(self):
        self.timeEnd = time.time()
        if self.timeEnd - self.timeStart > 5:
            if self.mpstate.status.armed:
                print(self.timeEnd - self.timeStart)
                print(self.mpstate.status.gps)
                self.showStatus()
                self.controlSeq()
#            else:
#                self.arm()

    #Option 1 for send and receive signals and calls sendQuadControls to send to Quad
    #checks for connection and armed quad before sending socket messages
    def controlSeq(self):
        if not self.bound:
            self.enableConn()
        if self.bound:
            self.sendData()
            msg_received = self.getData()
            if msg_received.decode("UTF-8") == '':
                print("broken")
            else:
                if msg_received != "Dud":
                    self.currentVal = msg_received
                    print("socket no good")
                self.sendQuadControls()
        else:
            pass
    
    #Sends Control values to the quad if there is a change from 
    #previous values to reduce processor and serial overhead
    def sendQuadControls(self):
        if self.currentVal != self.oldVal:
            self.oldVal = self.currentVal
            self.currentVal = msg_received.decode("UTF-8") + ':0:0:0:0'
            rcVal = self.currentVal.split(':')
            rcVal = map(int, rcVal)
            print(rcVal)
            self.module('rc').override = rcVal
            self.module('rc').override_period.force()

    #Send data to socketserver
    def sendData(self):
        try:
            msg_outAlt = "%.1f" % mpstate.status.altitude
        except:
            msg_outAlt = "NOALT" 
        try:
            msg_outGS = "%.1f" % mpstate.status.msgs['VFR_HUD'].groundspeed)
        except:
            msg_outGS = "NOSPEED"
        msg_out = msg_outAlt + ":" + msg_outGS
        try:
            self.outSock.sendto(msg_out, self.outSock_address)
        except socket.error as e:
            print("Message out failed :" + e)

    #recieve data from socket server
    def getData(self):
        try:
            pkt = self.inSock.recv(1024)
           # print("pkt")
            return pkt
        except socket.error as e:
            print(e)
            return "Dud"

    #stop proces with terminal command 'stop'
    def cmd_stop(self, args):
        self.inSock.close()
        self.outSock.close()
        self.master.arducopter_disarm()
        self.bound = False
        self.squidArmed = False
        print("Disconnected")

    #arming sequence
    def arm(self):
        #self.module('rc').override = [1500, 1500, 1100, 1500, 0, 0, 0, 0]
        print("Arming")
        self.timeStart = time.time()
        self.master.arducopter_arm()

    #experimental waypoint guidance    
    def goToWaypoint(self, quadAlt, newLat, newLong):
        altitude = quadAlt
        lat =newLat
        lon = newLong

        self.master.mav.mission_item_send(self.target_system,
                                               self.target_component,
                                               0,
                                               mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT,
                                               mavutil.mavlink.MAV_CMD_NAV_WAYPOINT,
                                               2, 0, 0, 0, 0, 0,
                                               lat, lon, altitude)

    def enableConn(self):
        self.inSock.bind(self.inSock_address)
        self.inSock.setblocking(0)
        self.bound = True    

    def switchMode(self, setMode):
        if setMode != currentMode:
            self.module('mode').cmd_mode(setmode)
            currentMode = setMode
        else:
            pass
    
    def showStatus(self):
        if self.master.WIRE_PROTOCOL_VERSION == '1.0':
            gps_heading = self.status.msgs['GPS_RAW_INT'].cog * 0.01
        else:
            gps_heading = self.status.msgs['GPS_RAW'].hdg

        print("heading: %u/%u alt: %u/%u r/p: %u/%u speed: %u/%u thr: %u" % (
            self.status.msgs['VFR_HUD'].heading,
            gps_heading,
            self.status.altitude,
            self.gps_alt,
            math.degrees(self.status.msgs['ATTITUDE'].roll),
            math.degrees(self.status.msgs['ATTITUDE'].pitch),
            self.status.msgs['VFR_HUD'].airspeed,
            self.status.msgs['VFR_HUD'].groundspeed,
            self.status.msgs['VFR_HUD'].throttle))

    #safer unload
    def unload(self):
        self.inSock.close()
        self.outSock.close()
        self.master.arducopter_disarm()
        self.bound = False
        self.squidArmed = False

    #run option 2, arm check is only run against rc value updates
    def controlSeq2(self):
        self.enableConn()
        self.sendOut()
        msg_received = self.getData()
        if msg_received.decode("UTF-8") == '':
            print("broken")
        else:
            if msg_received != "Dud":
                self.currentVal = msg_received
                print("socket no good")
            self.sendQuadControls2()
        else:
            pass
    
    #only runs an arming check on the rc input
    def sendQuadControls2():
        if self.currentVal != self.oldVal:
            self.oldVal = self.currentVal
            self.currentVal = msg_received.decode("UTF-8") + ':0:0:0:0'
            rcVal = self.currentVal.split(':')
            rcVal = map(int, rcVal)
            if self.squidArmed:
                print("sent: " + rcVal)
                self.module('rc').override = rcVal
                self.module('rc').override_period.force()
            else:
                print("Not Sent: " + rcVal)   

def init(mpstate):
    '''initialise module'''
    return Testmod(mpstate)