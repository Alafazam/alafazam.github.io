---
layout: post
title: "Fast 2-way XBEE series 2 data"
tags: [projects, xbee, embedded]
---

[![](http://i.imgur.com/s6m8AqSl.jpg "Hosted by imgur.com")](http://imgur.com/s6m8AqS){: style="float:right;
width:40%;"}

Say that title out loud. It's a mouthful-- any yet it's not enough. There are so many names for these modules and a better title would be _Fast two way Xbee ZigBee Series 2 Znet 2.5 Serial AT Communication._ In my trials and tribulations building my quadcopter remote (soon I'll post about it) I've run across problems getting two way, full speed, and reliable communication between [my modules](http://www.sparkfun.com/commerce/product_info.php?products_id=8691). Here's what I discovered after a lot of manual reading:

### Fast two way Xbee ZigBee Series 2 Znet 2.5 Serial AT

The heart of the issue is that Xbee 2.5 modules are not designed (spesificlly) to be point-to-point direct communicators. Whereas Series 1 modules can communicate directly with zero configuration, these series 2 ZNET modules need some work. [Here's](http://www.dudek.org/blog/180) a great article on the difference. There's a few great articles on how to setup these znet modules, however they're really hard to find. (I can't even find which ones I've already manged to run across). Here's the basic setup:

<!--more-->

### Basic Series 2.5 Setup

1. First get [X-CTU](http://www.digi.com/support/kbase/kbaseresultdetl.jsp?kb=125)from digi. It's windows only, however:
  * [Wine](http://www.winehq.org/) on (_apt-get install wine_ for debian) **linux** will let it install and run perfectly.
  * Wine also runs on **Macs**, try [this](http://winebottler.kronenberg.org/).
  * To get it to work correctly in wine, follow [this tutorial](http://lizard43.blogspot.com/2008/10/x-ctu-with-linux.html).
2. Open X-CTU, select your COM port, (see that tutorial if you're running linux or os x) set the serial baud rate, and click on the _Modem Configuration_ tab.
[![selecting com port](http://i.imgur.com/cdtCwZkl.png "selecting com port")](http://i.imgur.com/cdtCwZkl.png)
3. Read the current information from your xbee.
    * Note: if x-ctu complains, it's likely missing the latest firmware. Try the _Download new version _button to automatically get them, but I've never had that work. Go to the digi [download page](http://www.digi.com/support/productdetl.jsp?pid=3261&amp;osvid=0&amp;s=269&amp;tp=2) and download the .zip file then give that to x-ctu.
4. Change the _Function Set _dropdown menu to ZNET 2.5 COORDINATOR AT. One and only one coordinator xbee is required for each series 2.5 network. [![selecting firmware](http://i.imgur.com/MQTJVc0l.png "selecting firmware")](http://i.imgur.com/MQTJVc0l.png)
5. Check the _Always update firmware _box then click _write._
6. Optional configuration:
    * You can change the **PAN ID **to something unique if you'd like, but you'll also need to change the other module to match it exactly.
    * Change your **serial baud rate **if you want to communicate faster then 9600 bps. Scroll down to _serial interfacing _to find that option.

Sweet, it's all set for automatically packetized, full-speed serial communication.

[![xbees-together](http://i.imgur.com/172YcKcl.jpg)](http://i.imgur.com/172YcKcl.jpg "xbees-together")

### Fast, reliable two-way data: not what you get

The problem you may soon discover is that the communication from the coordinator to the _ZNET 2.5 ROUTER/END DEVICE AT_ (I call this on the node) slows to a halt after a few dozen bytes and never catches up when there's regularly sent data. Data coming from the node to the coordinator is fine.

### The Fix

Taking with the idea from [this forum](http://forums.digi.com/support/forum/viewthread_thread,683_lastpage,yes#2528) posting and mixing in lots of reading of [the manual](http://docs.google.com/viewer?url=http://www.sparkfun.com/datasheets/Wireless/Zigbee/XBee-2.5-Manual.pdf), I discovered that if the coordinator is told to only send to your one node it works flawlessly. I came up with this process after reading into the configuration options further.

1.  Go back into X-CTU configuration and name _each module_ (I called mine PICARD and RIKER) using the **NI**, or Node Identifier, option (+++ATNI PICARD WR if you know what you're doing).
2.  Write the changes.
3.  Power-on both modules, with the _coordinator_ connected to the computer.
4.  Click on the _Terminal _tab.
5.  Type **+++** to go into command mode, don't hit return. Be sure it outputs _OK_.
6.  Type **ATND** (and return) to show connected modules, to be sure your NODE and all it's address information is there. All the commands start with AT, and the ND is _Node Discover_.
7.  Type **ATDN &lt;your node's NI&gt;** (and return). That's the command for _Destination Node_, space, and the _Node Identifier_ you created earlier and just confirmed in the previous step. _It should return \_OK\__.This sets the DH and DL values to the SH and SL values from the node. This means the destination address (both High and Low halves) are automatically set to the serial number from the node. All communication will now only go to the node when coming from the coordinator.
 [![writing addresses](http://i.imgur.com/A0fXHmfl.png)](http://i.imgur.com/A0fXHmfl.png)
8.  Type +++ again to enter command mode then type WR (and return) to save settings. If it returns _OK_ then You're done!

### Por fin

Here's what JordanH [said](http://forums.digi.com/support/forum/viewthread_thread,683_lastpage,yes#2528) on the digi discussion boards:

> [Not setting a destination address] will transmit each and every packet from the XBee module as a broadcast packet. Broadcast data is unreliable and unacknowledged so that may explain the behavior you are seeing.

Now that we've got the address set, go send some data!
