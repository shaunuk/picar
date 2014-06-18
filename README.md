picar
=====

Raspberry Pi client/server rc car control system utilising a smartphone/tablet browser gyro and html5/javascript running on node.js with websockets.

Demo:
https://www.youtube.com/watch?v=JSP6VKiU7F4

Instructions:
![](https://github.com/lawsonkeith/Pi-Rc-Car/media/picar_scematic.PNG)


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
