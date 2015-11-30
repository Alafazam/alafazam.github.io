---
layout: post
title: "RTOS quadcopter flight computer"
tags: [projects, flying, embedded]
---

Update: [firmware](https://github.com/t413/os_copter), [remote](https://github.com/t413/remote_xbee),
and [packet library](https://github.com/t413/ser_pkt) all now on github.

[![](http://i.imgur.com/gQg8QG5l.jpg "Flight controller detail shot. Hosted by imgur.com")](http://imgur.com/gQg8QG5){: style="float:right;width:50%;"}

The advent of the modern Chinese manufacturing empire has fueled an explosion of high performance, high quality, reliable, accessible, and low-cost hobby electronics like never before. That, coupled with technological advances, have made electric systems more than just an alternative to nitro fuel powered models. The technology improvements have also enabled, for the first time, hobby-level computer flight control systems and even autopilots. Many commercial and community projects have been developed to perform these tasks and out of them have come low-cost, electric powered, computer controlled planes, cars, conventional helicopters, and helicopters that defy convention. Copters with two, three, four, six, and even eight rotors have taken root in the community as a simple and effective way to lift large payloads, film smooth aerial video, and perform unbelievable acrobatics.

As part of a previous project I built a quadcopter with a laser-cut ABS plastic frame and modified version of the open source AeroQuad project. This semester I built my own open source flight software for quadcopters using the NXP LPC2148 ARM 7 processor on an FreeRTOS system. This allows the inherently unstable quadcopter to fly as a human controllable helicopter with only the addition of a wii motion plus as a gyroscope sensor for rotational acceleration.

[![](http://i.imgur.com/GOud01Pl.jpg "Quadcopter design wide shot. Hosted by imgur.com")](http://imgur.com/GOud01P)

* Technology breakdown
* CPU: Phillips NXP LPC2148 ARM7
* FreeRTOS, compiled with arm-elf-gcc
* 32-bit, 40kB RAM, 60Mh, 512kB Flash
* Nintendo Wii Motion+ gyroscope, I<sup>2</sup>C
* 4xPWM PPM Brushless speed controllers
* Packetized XBee communication
* Accurate, 10bit remote with backlit LCD
  * Four level menu system

[![](http://i.imgur.com/xHCccO3l.jpg "Remote control. Hosted by imgur.com")](http://imgur.com/xHCccO3)

### Background

I like remote controlled gadgets a lot. Moving beyond the 2d world of RC cars has long been my dream, but until last year it was just that: a dream. I designed and built a simple rover, controlled by a mint tin that you could simply tilt in the direction you wanted it to drive. After mastering a simple $40 mall-bought helicopter I wanted to move bigger. Rather than shell out several hundred dollars for a regular helicopter I decided to build an AeroQuad quadcopter using parts from hobbyking.com and sparkfun.com. I built my first frame, crashed a lot, and had many issues with my 15 year old FM radio controller. I designed a basic laser-cut acrylic remote and wrote modifications to fly it over a digital XBee connection. I then designed and built a laser-cut ABS plastic frame for the copter.

When I dealt with speed and reliability issues when sending ascii values over serial I decided to design a data packet transfer method similar to UDP. Upon arriving to SJSU I implemented although never finished testing a method for altitude control. I started the year with no idea for how the stabilization with PID control worked, specifically how any of the data busses were implemented, or how the sensor data was processed or used. In the course of this past year of reading, taking apart, fixing, and implementing my own features I’ve learned a great deal. I decided for my open-ended project for CMPE 146 that I’d design and  implement my own flight computer program using the real-time operating system FreeRTOS.

<!--more-->

### Overarching Design

#### RTOS

The use of a real-time operating system allows for many advantages in the future that aren’t possible with a timer/scheduling design. Independent tasks can run without inhibiting each-other and with prioritization that will allow things like stabilization and communication to run alongside data acquisition or guidance. The essential tasks for flying were stabilization and communication, and that’s where I started the design process.

#### Control Theory

Quadcopter stabilization depends on quickly being able to update the motor speed to minimize or zero rotational acceleration. If we used the _rotation angle_ it would be an unstable system; by the time the helicopter has changed position enough to register a proportional response it would be thrown back, past it’s correct location, and in the negative range. The helicopter would oscillate and crash, dramatic and unsuccessful. The rotational acceleration data is acquired by taking the derivative of the absolute tilt angles. To get tilt angles one must integrate the angular acceleration data provided by MEMS gyroscopes and compensate drift using accelerometer data. To simplify this process of integrating then differentiating the same data, I elected to use the gyroscope data directly. Using a fusion of the gyro, accelerometer, and magnetometer data to get a compensated and accurate absolute angle will provide a means of auto-balancing in the future, but for now I can use just the gyroscopes to get a stable and controllable helicopter I can fly.

#### Sensors

For sensors I had many options. For my first quadcopter I used sparkfun’s Razor 6dof board, but it’s analog sensors were not temperature compensated and when I tested them I found they took about an hour to become just marginally consistent. They also had a small ‘full-scale range’ which severely limited their accuracy and required an external analog-to-digital converter which left room for interference and bias. All of these shortcomings made my desire to move to an integrated digital sensor, and there are such sensors, soldered and ready to use, on the market for around $30-40. Instead of buying one of those I decided to use the Nintendo Wii Motion+ which had the advantage of being less than $20, readily available to consumers worldwide, and widely supported by the home-brew community online. The Wii Nunchuck attachment would provide accelerometers in the future.

### Technology breakdown

#### PWM

To utilize off-the-shelf components was a major goal of mine. This allows for modularity and low-cost/high-cost options and fast innovation. To interface with brushless motors one must use exactly timed high-current three phase control signals. Easy to use, integrated speed controllers are widely available and all use the same interface: Pulse Position Modulation or PPM. Every 20ms a new signal starts, stays on between 1 and 2ms, then goes low. That time between 1 and 2ms determines the speed controllers’ speed. PPM signals must be precise and reliable, and the best way to ensure both was to use the PWM timer functionality on the LPC board.

There are three steps to generating a PWM signal on the LPC. First setup the general PWM ability, then setup each port you want to use, and finally latch a new duty cycle value. I wrote a header and c library for PWM control and a functionality specifically to set it up to generate a PPM compatible signal, independent of the peripheral clock’s configuration. There are four motors on the helicopter so I needed four separate PWM channels. I used timers 2, 4, 5, and 6 so that UART0 would be still usable.

#### I<sup>2</sup>C

The Nintendo Wii Motion+ sensor interfaces with the Wiimote over I<sup>2</sup>C. I<sup>2</sup>C is a useful bus for connecting many low-ish speed digital devices for simple data transfer. It uses 2 wires, SCA and SCL, data and clock respectively. This is a multi-slave bus capable of communicating with many devices without a chip select signal. The addresses are 8 bit with the least significant bit signifying whether to read or write to the device at the address of the other 7 bits. The bus’s single master device initiates commands and reads results, pulling the bus’s wires high with a pull-up resistor. I soldered in 2x4.5kΩ pull-up resistors and made a connector for the Motion+ and was able to read data.

To initialize the sensor I had to send the value 0x04 to register 0xFE at address 0xA6 then 0x05 to register 0xFE to finish the setup. Then the sensor would switch addresses to 0xA4 where it would let you read 6 bytes starting from register 0x00. The data was then decoded from the returned 6 bytes and used in the flight routine.

#### XBee

[![](http://i.imgur.com/s6m8AqSl.jpg "Xbee detail shot. Hosted by imgur.com")](http://imgur.com/s6m8AqS){: style="float:right;
width:35%;"}

For communication I used the XBee Series 2 wireless modules. For detailed setup information and operation of the modules, see my previous report on the subject at [t413.com/news/fast-2-way-xbee-series-2-data](http://t413.com/news/fast-2-way-xbee-series-2-data). I used UART0 for the XBee because UART1 shares the same pins as the timers for PWM 4 and 6. This required me to switch the UART / FTDI switch each time I want to program the µC, but there doesn’t seem to be a way around this except to design a native USB bootloader so that the FTDI chip can be left off. (future project: DUF bootloader)

The data sent over the XBee is a simple packetized data transfer method with a header, type, length, payload and checksum design. This allows for a means of checking command integrity, something I found to be vitally important. It also reduces the command size and expedites the data processing on both ends. See the library at [github.com/t413/ser_pkt](https://github.com/t413/ser_pkt).

### Task breakdown

#### Communication Task

This task simply runs getSerialPacket(), then runs a series of switch()es to decide what to do with each type of received data and do it. When, for example, it gets a kind of USER_CONTROL and type of FULL_REMOTE (#defined as macros on both the transmitter and receiver) it reads all four 16 bit integers it expects, processes it by scaling the pitch/roll/yaw values, and saving it to the flight_settings struct. This flight_settings structure is passed by reference to both the communication task and the flight task and is used directly by the flight task to fly the quadcopter.

[![xbees-together](http://i.imgur.com/172YcKcl.jpg){: style="width:60%;margin:auto;"}](http://i.imgur.com/172YcKcl.jpg "xbees-together"){: style="display:block;text-align:center"}

#### Flight Task

The flight task sets up and handles the motors, sensors, and the PID control between the two. On startup it averages and zeroes the gyro sensor data, although this can be done at any time after startup with a signal from the remote. The main loop gets sensor data with update_wii_data(), which passes by reference a struct for the returning values and the calibrated zeroes. This will allow easy modification for other sensors in the future. It then calculates an offset value for the pitch, roll, and yaw based on the target value from the user’s remote and the sensor values, fused using PID control. The PID data settings are passed by reference and stored in the same flight_settings struct described before. If the quadcopter is armed then the offsets are added to the base throttle and sent to the motors using write_motors which is part of the motors.h library.

#### Arming process

The The arming process is to maintain safe and predictable operation. The first requirement is for the remote to be sending data to the quadcopter. If the quadcopter doesn’t receive new data commands from the remote within 0.5 seconds of the last packet then it will disarm. This is to prevent lost communication or a pulled plug on the remote from sending the quadcopter flying out of control. When I can operate it autonomously I can specify that it not kill all motors as it does now, but rather safely land or fly home. Once data is being regularly sent the throttle must be below 10% and the yaw must be within 10% of its maximum, just as a precaution and an explicit way to say ‘start flying.’ Then the motors will spin slowly and throttle can be applied to lift off and fly.

### Downloads

This is an open source project under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 license. See this page for details: [http://creativecommons.org/licenses/by-nc-sa/3.0/us/](http://creativecommons.org/licenses/by-nc-sa/3.0/us/)

OS-copter project, now on GitHub: [github.com/t413/os_copter](https://github.com/t413/os_copter)

Remote project on GitHub: [github.com/t413/remote_xbee](https://github.com/t413/remote_xbee)

Packet communications project on GitHub: [github.com/t413/ser_pkt](https://github.com/t413/ser_pkt)



