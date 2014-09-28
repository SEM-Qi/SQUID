#/bin/bash
#
# Use to get GPS working. If pi is restarted the daemon gpsd needs to be shut down and restarted
# and needs to be pointed to the right device and socket when starting up.
#
sudo killall gpsd
sudo gpsd /dev/ttyUSB0 -F /var/run/gpsd.sock