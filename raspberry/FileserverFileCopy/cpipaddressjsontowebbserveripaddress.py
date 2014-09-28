#!/usr/bin/python
import time, os

def main():

 while(True):
  os.system ("cp /home/pi/qiipaddress/ipaddress.json /var/www/ipaddress/")
  os.system ("cp /home/pi/qiipaddress/ipaddress.json /usr/local/bin/GC_SERVER/public/ipaddress/")
  time.sleep (5)

main()
