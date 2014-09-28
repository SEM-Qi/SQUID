#!/usr/bin/env python

import errno
import socket
import sys
import json
from time import sleep

mpstate = None



from MAVProxy.modules.lib import mp_module
        


class Testmod(mp_module.MPModule):
    def __init__(self, mpstate):
        super(Testmod, self).__init__(mpstate, "testmod", "mod that tests")
        self.add_command('stop', self.cmd_stop, "stop server", ['<1|2|3|4|5|6|7'])
        self.sim_out_address = ('127.0.0.1', 8425)
        self.sim_out = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sim_in_address = ('127.0.0.1', 8424)
        self.sim_in = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sim_in.bind(self.sim_in_address)
        self.sim_in.setblocking(0)
	    self.currentVal = '1500:1500:1000:1500'
	    self.oldVal = '0'
        # while True:
        #     msg_received = sim_in.recv(1024)
        #     if msg_received.decode("UTF-8") == "":
        #         break
        #     else:
        #         self.controllerMSG = msg_received.decode("UTF-8")

    def idle_task(self):        
        self.sim_out.sendto("message", self.sim_out_address)
        msg_received = self.getData()
        print("before comparison")
	if msg_received.decode("UTF-8") == '':
            print("broken")
        else:
	    self.currentVal = msg_received.decode("UTF-8") + ':0:0:0:0'
            if self.currentVal != self.oldVal:
                self.oldVal = self.currentVal
                rcVal = self.currentVal.split(':')
                rcVal = map(int, rcVal)
                print(rcVal)
                self.module('rc').override = rcVal
                self.module('rc').override_period.force()
            else:
                pass
        
    def getData(self):
        try:
            pkt = self.sim_in.recv(1024)
	   # print("pkt")
            return pkt
        except socket.error as e:
            return "socket no good"

    def cmd_stop(self, args):
        self.sim_in.close()
	    self.sim_out.close()
        print("Disconnected")




def init(mpstate):
    '''initialise module'''
    return Testmod(mpstate)
