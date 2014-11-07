#! /bin/sh
# /etc/init.d/node-server

### BEGIN INIT INFO
# Provides: 		node-sever
# Required-Start: 	$remote_fs $syslog
# Required-Stop:	$remote_fs $syslog
# Default-Stop:		$remote_fs $syslog
# Default-Start:	2 3 4 5
# Default-Stop:		0 1 6
### END INIT INFO

export PATH=$PATH:/home/pi/picar
path_node=/home/pi/picar/app.js
# required since all files are here
cd /home/pi/picar

case "$1" in
	start)
		sleep 1
		echo "starting node-server"
		echo "[$date]" >> /var/log/node-server.log		
		node $path_node >> /var/log/node-server.log & 
		;;
	stop)
		echo "stop node-server"
		echo "['date']" >> /var/log/node-server.log
		killall node
		
		;;
	*)
		echo "Usage start|stop"
		exit 1
		;;
esac
exit 0

