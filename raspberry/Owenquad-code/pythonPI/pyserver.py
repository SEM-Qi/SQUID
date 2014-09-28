import socket
import json 
import serial
from time import *

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(('0.0.0.0',7000))

start = time()

ser = serial.Serial('/dev/ttyUSB0', '57600')

#chksum calculation
def chksum(str):
  c = 0
  for a in str:
    c = ((c + ord(a)) << 1)% 256
  return c

#main loop
def main():
  while True:
    # wait for UDP packet
    data,addr= sock.recvfrom(1024)
    data = data.replace("'", "\"");

    # parse it
    p = json.loads(data)

    # if control packet, send to ardupilot
    if p['type'] == 'rcinput':
      str = "%d,%d,%d,%d" % (p['roll'], -p['pitch'], 1070 +  p['thr']*10, p['yaw'])
      #calc checksum
      chk = chksum(str)
      
      #concatenate msg and chksum
      output = "%s*%2x\r\n" % (str, chk)
  
      print output    
      ser.write(output)
      ser.flush()

      
main()