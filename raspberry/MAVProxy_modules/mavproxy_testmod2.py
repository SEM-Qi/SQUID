#!/usr/bin/env python

import errno
import socket
import sys



mpstate = None



from MAVProxy.modules.lib import mp_module
        


class Testmod(mp_module.MPModule):
    def __init__(self, mpstate):
        super(Testmod, self).__init__(mpstate, "testmod2", "mod that tests")
        self.add_command('stop', self.cmd_stop, "stop server", ['<1|2|3|4|5|6|7'])
        self.sim_out_address = ('127.0.0.1', 8425)
        self.sim_out = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sim_in_address = ('127.0.0.1', 8424)
        self.sim_in = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sim_in.bind(self.sim_in_address)
        self.sim_in.setblocking(0)
        self.currentVal = '1500:1500:1050:1500'
        self.oldVal ='0'
        # while True:
        #     msg_received = sim_in.recv(1024)
        #     if msg_received.decode("UTF-8") == "":
        #         break
        #     else:
        #         self.controllerMSG = msg_received.decode("UTF-8")  

    def idle_task(self):
        try:
            msg_outLat = ("%.14f" % self.status.msgs['GLOBAL_POSITION_INT'].lat)
        except:
            msg_outAlt = "NOLAT"
        try:
            msg_outLon = ("%.14f" % self.status.msgs['GLOBAL_POSITION_INT'].lon)
        except:
            msg_outAlt = "NOLON"
        try:
            msg_outAlt = ("%.1f" % self.mpstate.status.altitude)
        except:
            msg_outAlt = "NOALT"
        try:
            msg_outGS = ("%.1f" % self.mpstate.status.msgs['VFR_HUD'].groundspeed)
        except:
            msg_outAlt = "NOALT"        

        msg_out =  msg_outLat + ":" + msg_outLon + ":" + msg_outAlt + ":" + msg_outGS
        self.sim_out.sendto(msg_out, self.sim_out_address)
        msg_received = self.getData()
        if msg_received.decode("UTF-8") == '':
            print("broken")
        else:
            if msg_received != "Dud":
                self.currentVal = msg_received
                if self.currentVal != self.oldVal:
                self.oldVal = self.currentVal
                interVal = self.currentVal.split(':')
                rcVal = interVal[0:4]
                rcVal.extend(['0','0','0','0'])
                rcVal = map(int, rcVal)
                print(rcVal)        
                self.module('rc').override = rcVal
                self.module('rc').override_period.force()
        
    def getData(self):
        try:
            pkt = self.sim_in.recv(2048)
           # print("pkt")
            return pkt
        except socket.error as e:
            print("socket no good")
            return "Dud"

    def cmd_stop(self, args):
        self.sim_in.close()
        self.sim_out.close()
        print("Disconnected")




def init(mpstate):
    '''initialise module'''
    return Testmod(mpstate)
