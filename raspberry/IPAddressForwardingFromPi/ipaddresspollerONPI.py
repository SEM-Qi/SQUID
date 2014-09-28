#!/usr/bin/python
# Written by Jani Pasanen 2014-05-15

import re, os, json, io, syslog, time

# Get data from ifconfig ppp0 and input to ifconfigDev.txt. If device ppp0 does not exist error will be sent to 
# ipaddress.json textfile and the remaining commands below time.sleep (15) will no be executed. 

while(True):
 #os.system("if [-f /dev/ppp0]; then {ifconfig ppp0 > ifconfigDev.txt 2> /dev/null} else")
 os.system("ifconfig ppp0 > ifconfigDev.txt 2> /dev/null")
 #time.sleep (5)      

# check if ifconfigDev.txt is empty or not

 try:
     if os.stat("./ifconfigDev.txt").st_size > 0:
      
      # Read in the contents of ifconfigDev.txt and store it into the string called string
      f = open('ifconfigDev.txt', 'r')
      string = ""
      while 1:
        line = f.readline()
        if not line:break
        string += line

     
       # Do regular expression on string and output only the ipaddress
        re1='.*?'	# Non-greedy match on filler
        re2='((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?![\\d])'	# IPv4 IP Address 1
       
        rg = re.compile(re1+re2,re.IGNORECASE|re.DOTALL)
        m = rg.search(string)
        if m:
             ipaddress1=m.group(1)
             ipaddress = ""+ipaddress1+""
      f.close()
       
     
         
     # Give values to the strings used for json
      name = "SQUID"
      owner = "QI"
      ip = ipaddress
          
         
     # Write the ipaddress to ipaddress.json and define the ids in the json file and the indentation
      f = open("ipaddress.json",'w')
      json.dump({'name':name, 'owner':owner, 'ip':ip}, f, indent=4)
        
      # Output of json should be like this
      #{
      #    "drone-name": "SQUID",
      #    "owner": "QI",
      #    "ip":"12.565.122.255"
      #}
         
      f.close()
      time.sleep(5) 
       
      # Execute linux command scp and tranfer the file to remote server
      os.system("sudo scp -i /home/pi/.ssh/id_rsa ipaddress.json pi@qi.homeip.net:./qiipaddress/")
      os.system("cp ipaddress.json /home/pi/project_vt14/SQUID/Webapp/DRONE_SERVER/public/ipaddress/")       
       
     else:
          os.system("killall ipaddresspollerpy.py")
#	  syslog.syslog(syslog.LOG_ERR, "The file ifconfigDev.txt is empty!")
     
 except OSError:
  syslog.syslog(syslog.LOG_ERR, "The file ifconfigDev.txt is empty! Error!!" )
