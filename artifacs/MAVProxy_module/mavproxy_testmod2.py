#!/usr/bin/env python

import errno
import socket
import sys

#MAVProxy is a python construct that is designed to operate as a CLI Groundstation for UAVs

mpstate = None


from MAVProxy.modules.lib import mp_module
        
#The module class, structured so as to inherit the properties of the MAVProxy module template
#The overridden init fucntion provides a constructer which accepts itself and the current 
#state of the main MAVproxy program (mpstate) as arguments. Calling mpstate gives you 
#data on variables from the Ardupilot that are gleaned by MAVProxy
#https://github.com/tridge/MAVProxy/tree/master/MAVProxy/modules and
#https://github.com/tridge/MAVProxy/tree/master/MAVProxy/modules/lib/mp_module.py for more info

class Testmod(mp_module.MPModule):
    def __init__(self, mpstate):
        super(Testmod, self).__init__(mpstate, "testmod2", "mod that tests")
        
        #Use the module structure to allow the user to type 'stop' in the MAVProxy CLI 
        #and trigger the stop function
        self.add_command('stop', self.cmd_stop, "stop server", ['stop'])

        #Set up and prepare the UDP socket connections for communication with the wsserver.js
        #Non blocking UDP sockets are required due to the nature of the main 
        #MAVProxy loop, its threads and its own socket and serial connection to the Ardupilot
        self.sim_out_address = ('127.0.0.1', 8425)
        self.sim_out = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sim_in_address = ('127.0.0.1', 8424)
        self.sim_in = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sim_in.bind(self.sim_in_address)
        self.sim_in.setblocking(0)
        
        #dummy values to kick off the main RC input loop at a safe throttle value
        self.currentVal = '1500:1500:1050:1500'
        self.oldVal ='0'  

    #Idle task is called at roughly 100Htz by the main loop of MAVProxy, Loops and threads are 
    #frowned upon in MAVProxy modules for the simple reason that they tie up the main 
    #loop and break the heartbeat safeguards of the Ardupilot serial Conn 
    def idle_task(self):
        #Pull the direct MAVLink message with GPS data, convert the int to a float, and format it as a string
        #Dummy data is used in case of failure (i.e. no GPS lock)
        try:
            msg_outLat = ("%.14f" % float(self.status.msgs['GLOBAL_POSITION_INT'].lat/10000000))
        except:
            msg_outLat = "57.706815"
        try:
            msg_outLon = ("%.14f" % float(self.status.msgs['GLOBAL_POSITION_INT'].lon/10000000))
        except:
            msg_outLon = "11.936870"
        #From MPstate attempt to get values for groundspeed and altitude
        try:
            msg_outAlt = ("%.1f" % self.mpstate.status.altitude)
        except:
            msg_outAlt = "NOALT"
        try:
            msg_outGS = ("%.1f" % self.mpstate.status.msgs['VFR_HUD'].groundspeed)
        except:
            msg_outGS = "NOALT"        

        #send UDP packet to wsserver containing above arupilot date to prompt a 
        #response with latest controls
        msg_out =  msg_outLat + ":" + msg_outLon + ":" + msg_outAlt + ":" + msg_outGS
        self.sim_out.sendto(msg_out, self.sim_out_address)
        
        #Listen for response from wsserver
        msg_received = self.getData()
        
        #Check for empty values, bad packets. 
        if msg_received.decode("UTF-8") == '':
            print("broken")
        elif msg_received != "Dud":
            self.currentVal = msg_received

            #Check if the old value is different to the old value to reduce 
            #load on the serial connection and ESCs
            if self.currentVal != self.oldVal:
                self.oldVal = self.currentVal
                interVal = self.currentVal.split(':')
                rcVal = interVal[0:4]
                rcVal.extend(['0','0','0','0'])
                rcVal = map(int, rcVal)
                print(rcVal)
                #        
                self.module('rc').override = rcVal
                self.module('rc').override_period.force()
    
    #Function for accepting data from the wsserver, it recieves and returns the UDP packet
    #if it fails it returns "Dud", to be handled in a check above    
    def getData(self):
        try:
            pkt = self.sim_in.recv(2048)
            return pkt
        except socket.error as e:
            print("socket no good")
            return "Dud"

    #manual stop command that closes sockets and disarms quadcopter
    def cmd_stop(self, args):
        self.sim_in.close()
        self.sim_out.close()
        self.master.arducopter_disarm()
        print("Disconnected")
    
    #override the inherited unload function to ensure that on unload, all sockets are closed
    #and the quadcopter is disarmed.    
    def unload(self):
        self.sim_in.close()
        self.sim_out.close()
        self.master.arducopter_disarm()
        print("Disconnected")


def init(mpstate):
    '''initialise module'''
    return Testmod(mpstate)
