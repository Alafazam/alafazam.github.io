---
layout: post
title: "Wireless Wii Robot"
tags: [projects, youtube, xbee, embedded]
---

[![](http://i.imgur.com/C9QO3CJl.jpg "Hosted by imgur.com")](http://imgur.com/C9QO3CJ)

Physical computing -> wireless two-way data -> physical control. This is a intuitive, durable, and fun way to control almost anything. Here I've built a transmitter which reads data from the Wii nunchuck and sends it over xbee. The rover receives the xbee broadcast, decodes it, maps it to drive the tank-like dual motor setup, and controls the motor driver IC. To achieve my goal of a small mint-tin fitted remote I used a lithium polymer (LiPo) battery, and to make them safer I included a voltage monitoring subroutine. The result is modular, easily incorporated into future projects, or disassembled for different use. Here are more details:

<div class="icontain"><iframe src="//www.youtube.com/embed/b9O7bzlCbT0" allowfullscreen></iframe></div>

### Transmitter

Arduino pro mini (3.3V version), xbee series 2.5, used wii nunchuck, lipo battery, old off-brand mint tin.

### Receiver

9V battery, Xbee, ATmega168, SN754410 H-Bridge motor IC, lego motors

##Pictures!

<div class="icontain i4x3"><iframe class="imgur-album" src="//imgur.com/a/VHjZg/embed?background=f2f2f2&text=1a1a1a&link=4e76c9"></iframe></div>


## Source Files

[View and download on GitHub](https://gist.github.com/t413/36974b8490b5e53683e5)

{% highlight cpp linenos=table %}
int ledPin =  13;

void setup(){
  Serial.begin(115200);
  nunchuck_init();
  pinMode(ledPin, OUTPUT);
  //print inital battery charge
  Serial.print("b=");
  Serial.print(update_batt_status());
  Serial.println("%");
}

void loop() {
  nunchuck_get_data();
  if (((nunchuck_buf[5] >> 0) & 1) ? 0 : 1){
    digitalWrite(ledPin, HIGH);
    send_packet();
  }
  else digitalWrite(ledPin, LOW);
{% endhighlight %}


These are provided under the same licence as my photos: [Creative Commons Attribution-Noncommercial-Share Alike 3.0](http://creativecommons.org/licenses/by-nc-sa/3.0/us/). Click on either image to download the one of the sketches.

## Software Requirements

*   Arduino IDE 017 or later (for the new Wire library)
*   That's it.

## Helpful links/Resources

*   Here's a great tutorial on how to understand/control this H-bridge motor IC: [DC Motor Control Using an H-Bridge](http://itp.nyu.edu/physcomp/Labs/DCMotorControl)
*   [Background and Power Supply](http://www.sparkfun.com/commerce/tutorial_info.php?tutorials_id=57), a SparkFun lecture on how to make a regulated power supply.
*   [Make Blog](http://blog.makezine.com) and [Make Magizine](http://makezine.com) - Great community with unparalleled creativity and originality. Notice the make magazines my bot crawls over?
*   Did you like my [Arduino AVR sticker label](http://todbot.com/blog/2009/05/23/arduino-chip-sticker-label/)? it's from todbot blog.

## Future Directions:

*   Packetized data transfer
*   Bigger bot: (I have a wheelchair I can't wait to get running..)
*   Put in an on/off switch and status leds.
*   Miniaturize the receiver into it's own mint tin once I have a more permanent (not lego) rover.
*   Force feedback by measuring of current draw on the motors, rumbling the nunchuck (or something).
*   Generally more two-way communication.
