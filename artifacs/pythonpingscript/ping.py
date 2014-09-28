#!/usr/bin/python
import subprocess
import os
with open(os.devnull, "wb") as limbo:
        for n in xrange(1, 254):
                ip="10.42.0.{0}".format(n)
                result=subprocess.Popen(["ping", "-c", "1", "-n", "-W", "2", ip],
                        stdout=limbo, stderr=limbo).wait()
                if not result:
                     print ip, "active"
#"inactive"
          #      else:
           #          print ip, "active"
