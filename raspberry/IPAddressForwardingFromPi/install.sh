#!/bin/bash

cp ./ipaddresspoller /etc/init.d/
chmod +x /etc/init.d/ipaddresspoller
update-rc.d ipaddresspoller defaults
if [! -d "/usr/local/bin/ipaddresspoller/" ]; then
mkdir /usr/local/bin/ipaddresspoller/
fi
cp ./ipaddresspoller.py /usr/local/bin/ipaddresspoller/
cp ./ipaddresspoller.sh /usr/local/bin/ipaddresspoller/
chmod +x /usr/local/bin/ipaddresspoller/ipaddresspoller.py
chmod +x /usr/local/bin/ipaddresspoller/ipaddresspoller.sh
if [ ! -d /usr/local/bin/ipaddresspoller/ ]; then
mkdir /usr/local/bin/ipaddresspoller/
fi
cp ./ipaddresspoller.py /usr/local/bin/ipaddresspoller/
cp ./ipaddresspoller.sh /usr/local/bin/ipaddresspoller/
chmod +x /usr/local/bin/ipaddresspoller/ipaddresspoller.py
chmod +x /usr/local/bin/ipaddresspoller/ipaddresspoller.sh
