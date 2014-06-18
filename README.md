#Pi-Rc-Car

![](https://github.com/lawsonkeith/Pi-Rc-Car/raw/master/media/DSC_0216.jpg)

##Overview
Use your raspberry pi to control a 1/10 scale RC car via a web page hosted wirelessly on your PI.  All you need to do is set up your PI to use your mobile as a hotspot then log onto the appropriate web page and tilt your phone to control your car.

##Electrical
This project is based on [shaunuk/picar] but replaces the servo board with a soft PWM driver on the PIs GPIO pins.

When it comes to powering the PI it is necessary to have a fairly stable 5V power supply.  For this example I had an old NICAD battery pack which dropped a lot of voltage when the car accelerated which caused the PI to keep resetting.  To get round that I've added a 7.2V battery and 5V linear power supply to give a clean 5V supply to the PI.  If you have a new NiMH battery you may not need this and might get away with powering off the 5V offered by the ESC.  To see if this is an option you'll need to use a multimeter and check how much that 5V line drops when your RC car is accelerated.

![](https://github.com/lawsonkeith/Pi-Rc-Car/raw/master/media/picar_scematic.PNG)

Raspberry Pi client/server rc car control system utilising a smartphone/tablet browser gyro and html5/javascript running on node.js with websockets.

Demo:
Based on 
https://www.youtube.com/watch?v=JSP6VKiU7F4

Instructions:
This project allows a mobile phone to control an RC car using wi-fi.  


tested with node 0.10.21

1. get node.js
2. get node dependencies (npm install socket.io node-static socket.io adafruit-i2c-pwm-driver sleep optimist)
3. edit app.js and socket.html for your servo positions.



To DO:

Loads,

1. make install easier - done
2. See if its possible to run without addon daughter board - not really possible
3. make app able to calebrate for your device.
4. better image streaming.
