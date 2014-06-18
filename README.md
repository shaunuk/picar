#Pi-Rc-Car

![](https://github.com/lawsonkeith/Pi-Rc-Car/raw/master/media/DSC_0216.jpg)

##Overview
Use your raspberry pi to control a 1/10 scale RC car via a web page hosted wirelessly on your PI.  All you need to do is set up your PI to use your mobile as a hotspot then log onto the appropriate web page and tilt your phone to control your car.  I've used an old Tamiya hornet in this example; any car will do but if you are buying one try and get one with enough space under the bodyshell to fit all your electronics.

##Electrical
This project is based on [shaunuk/picar] but replaces the servo board with a soft PWM driver on the PIs GPIO pins.  It's also possible to get rid of the battery power supply for the PI.

https://www.youtube.com/watch?v=JSP6VKiU7F4

When it comes to powering the PI it is necessary to have a fairly stable 5V power supply otherwise it keeps resetting when you drive the motor.  For this example I had an old NiCad battery pack which dropped a lot of voltage when the car accelerated which caused the PI to keep resetting.  To get round that I've added an additional 7.2V AA battery pack and a 5V linear power supply to give a clean 5V supply to the PI independant of the motor demands.  If you have a new NiMH battery you may not need this and might get away with powering off the 5V offered by the ESC.  To see if this is an option you'll need to use a multimeter and check how much that 5V line drops when your RC car is accelerated.  You'll also wqant to check the 5V is fairly stable and independant of throttle demands i.e doesn't go above 5.5V at any point.

There are a number of RC car electrical setups but my example uses a battery eliminator circuit (which I've not used because of the battery issue).  The electronics supply normally comes from the electronic speed controller (ESC) and powers the receiver and steeirng servo with 5V (note these devices are more tolerant of power supply dips than the Pi).  The receiver normally receives commands from the radio controller than sends them to the ESC (throttle) and steering servo (steering).  These commands fall within the 0-5V supplied by the ESC for example: 1V = steer fwds; 1.5 = steer right; 0.5 = steer left.

It is necessary at first to measure what your command signal voltage levels are and check they fall within the 0-3.3V range available by the PI GPIO lines.  You can do this with a multimeter connected to the receiver pins.  On my car speed and steering both use 3 pin headers which are wired:

Gnd - Black;   Power - Red;    Throttle / Steer - Orange or White

Once you are happy about how you are going to power your PI and that the GPIO are up to the job you can start thinking about wiring it up.

![](https://github.com/lawsonkeith/Pi-Rc-Car/raw/master/media/picar_scematic.PNG)

For the 3 pin headers I used 2.54mm PCB header and soldered wired direct.  I then used superglue to stop the pins moving about.  You'll also need heatshrink or equivalent to cover over the solder joints.
To power the PI I chopped a micr USB cable and used the black and red wires from that as my 5V supply.
For my linear power supply I used an LM7805 circuit and put a heatsink on it to keep it nice and cool:

![](https://github.com/lawsonkeith/Pi-Rc-Car/raw/master/media/reg cct.PNG)

I then attached a PP3 battery clip and 6xAA pack with a PP3 connector on it.
Check if your battery and ESC are up to powering the car in order to avoid having to go down the extra battery route.  
I've also ised a 26w header socket to attach to the raspberry PI GPIO lines; I like this method as it means it's hard to mi-wire when re-connecting.

You can see here how I've packaged everything up in the car.
![](https://github.com/lawsonkeith/Pi-Rc-Car/raw/master/media/DSC_0219.jpg)
The Pi Is placed in a plastic bag for protection; it's worth putting peice of card underneath it to make sure the PCB doesn't poke through the plastic.
![](https://github.com/lawsonkeith/Pi-Rc-Car/raw/master/media/DSC_0220.jpg)
Here you can see the wiring harness I made up including the linear regulator PCB and GPIO and interface connectors.
![](https://github.com/lawsonkeith/Pi-Rc-Car/raw/master/media/DSC_0221.jpg)

##Software 
The Pi uses node.js to sun a web server; a wi-fi dongle on the PI uses your phone as a wireless hotspot to enable wifi communications.  Once you enter the web address of the PI a dialog box appears prompting you to begin racing; at that point you can control your car by tiliting oyur phone.  An emergency stop is built into the app so if it loses comms to your phone the vehicle stops accelerating and steers forwards.  The Pi-Blaster program allows pins 17 and 18 of the PI to act as PWM outputs and control steering and throttle.
The app runs on raspbian using a raspberry PI rev B although you cauld use the A model.

###Get the app 
make a picar directory.
[cd /home/pi]
[sudo mkdir picar]
[cd picar]
Note - do everything in this dir.
Get this project from GITHUB.
[sudo git clone https://github.com/lawsonkeith/Pi-Rc-Car]

###Download node.js
Download a new version of node.js
[sudo wget http://nodejs.org/dist/v0.10.21/node-v0.10.21-linux-arm-pi.tar.gz]
Then unzip it.
[sudo tar -xvzf node-v0.10.21-linux-arm-pi.tar.gz]
Create symbolic links to the node executables
[sudo ln -s ~/picar/node-v0.10.21-linux-arm-pi/bin/node /bin/node]
Package manager
[sudo ln -s ~/picar/node-v0.10.21-linux-arm-pi/bin/npm  /bin/npm]
