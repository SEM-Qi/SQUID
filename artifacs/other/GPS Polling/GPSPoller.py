#! /usr/bin/python

 
import os
from gps import *
import time
import threading
import io
 
gpsd = None #setting the global variable
  
  
class GPSPoller(threading.Thread):
  def __init__(self):
    threading.Thread.__init__(self)
    global gpsd #bring it in scope 
    gpsd = gps(mode=WATCH_ENABLE) #starting the stream of info
    self.current_value = None
    self.running = True #setting the thread running to true
 
  def run(self):
    global gpsd
    while gpsp.running:
      gpsd.next() #this will continue to loop and grab EACH set of gpsd info to clear the buffer
 
if __name__ == '__main__':
  gpsp = GPSPoller() # create the thread
  try:
    gpsp.start() # start it up
    while True:
 
        # define what values to get from the GPS connected on the PI and store them to the variable latlong
        # Create a file in the specified location in write mode and store the data in the object f
        # and then print the values to the .csv text file and close it. 
        latlong = gpsd.fix.latitude, gpsd.fix.longitude
        f = open("/var/www/latlong.csv",'w')
        print >>f, gpsd.fix.latitude, gpsd.fix.longitude
        f.close()
        
         
        time.sleep(3) #wait 3 seconds
            
  except (KeyboardInterrupt, SystemExit): #when you press ctrl+c
            print "\nKilling Thread..."
            gpsp.running = False
            gpsp.join() # wait for the thread to finish what it's doing
            print "Done.\nExiting."