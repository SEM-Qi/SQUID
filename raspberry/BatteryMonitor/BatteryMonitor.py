from time import sleep
import RPi.GPIO as GPIO

#counter value indicates the voltage of the cells 
def warn(counter):
  if counter == 1:
    print ("WARNING: Cells reached 3.5 V")
  elif counter == 2:
    print ("WARNING: Cells reached 3.4 V")
  elif counter == 3:
    print ("WARNING: Cells reached 3.3 V")
  elif counter == 4:
    print ("WARNING: Cells reached 3.2 V")
  elif counter == 5:
    print ("WARNING: Cells reached 3.1 V")
  elif counter == 6:
    print ("WARNING: Cells reached 3.0 V")
  else:
    pass
  
GPIO.setmode(GPIO.BCM)
GPIO.setup(7, GPIO.IN) #7 or whatever GPIO pin we use

counter = 0
var = 1

GPIO.add_event_detect(7, GPIO.RISING)
while var == 1:  
  if GPIO.event_detected(7) and counter <= 6:
  #Loop while GPIO detect input, counter go up 1
  #Sleep for 1 sec (or as long as the break between 2 flashes of a LED)
    counter += 1
  sleep (1)
  if not GPIO.event_detected(7):
    if counter == 0:
      pass
    elif counter <= 6: 
    #give warning due to the value of counter
    #Then set counter to 0, and sleep 1min
      warn (counter)
      counter = 0
      sleep (60)
    else: 
    #If counter is bigger than 6, stop detecting input and give critical warning that cells drop below 3.0 V
      print ("WARNING: BATTERY CRITICALLY LOW! CELLS VOLTAGE BELOW 3.0V")
      break
    
GPIO.cleanup(7)
