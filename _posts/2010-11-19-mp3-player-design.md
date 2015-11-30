---
layout: post
title: "mp3 player design"
tags: [github, projects, embedded]
---

Recent edit: The project [is now on github!](https://github.com/t413/mp3_player_v2) with all the original svn commit history included.


###Background
[![](http://i.imgur.com/huV73nNl.jpg "Hosted by imgur.com")](http://imgur.com/huV73nN){: style="float:right;width:40%;"}

I'm participating in a national student exchange this semester at San Jose State University in Silicon Valley California. One of my classes is CMPE 146, Embedded Microprocessor System Design. For one of our projects we were told to make an mp3 player on the [dev board](https://sjvalley.com/shop/index.php?page=shop.product_details&amp;flypage=flypage.tpl&amp;product_id=27&amp;category_id=1&amp;option=com_virtuemart&amp;Itemid=63&amp;vmcchk=1&amp;Itemid=63) we had to buy for the class. Since the final goal was the same for each person the design was especially important. Here's my design:

There is also a handy [PDF version](/uploaded/mp3_player_design2.pdf).

### Technology breakdown:

*   CPU: [Phillips NXP LPC2148 ARM7](https://sjvalley.com/shop/index.php?page=shop.product_details&amp;flypage=flypage.tpl&amp;product_id=27&amp;category_id=1&amp;option=com_virtuemart&amp;Itemid=63&amp;vmcchk=1&amp;Itemid=63)
*   FreeRTOS, compiled with arm-elf-gcc
*   32-bit, 40kB RAM, 60Mh, 512kB Flash
*   512Kbyte SPI based Flash memory
*   SD Card with [elm-chan.org FAT-FS](http://elm-chan.org/fsw/ff/00index_e.html)
*   TI PCM1774 DAC &amp; Amplifier
*   Phillips PCA9535 I2C Port expander
*   ST STA013 SPI MP3 Decoder


### Downloads

This project is open source. My hope is that it helps others get started on their ARM without breaking their legs. If you're taking CMPE 146 want to bum off my code then be warned: my style is pretty distinctive and the TA knows my site.

The project [is now on github!](https://github.com/t413/mp3_player_v2) with all the original svn commit history included.

### Overarching Design Process

I was adamant to have a fully functional audio player that I could use on a regular basis. The button control must be straightforward and the song selection must be dynamic. Using the serial terminal to change settings, select songs, or to do anything at all necessary for playing music was off the table. The interface must be usable by anyone who’s used an iPod despite not having an lcd.
<!--more-->


I decided to structure the task communication and song handling around playlists. Sending the mp3 player task a single file using xQueue to queue up songs doesn’t allow for a previous track button,  is resource heavy with many songs, and would be limited in playlist length. Therefore I devised a way (see section on mp3_task) to recursively scan the SD card and dynamically create playlists of tracks separated by artist. I dedicated two buttons, + -, to navigate through the found artists and start that artist’s playlist. The mp3 playing task now just takes a pointer to a playlist that already exists and can simply navigate forward and reverse through it. I also added the variable behavior of the previous button to jump to the beginning of the track when just a few seconds into the song (exactly as most modern players do). This also leaves room for playlists based on album, genera, or user-generated playlists (however, with only buttons and no LCD that would be far far to complex of a UI).

[![](http://i.imgur.com/6rHjSGPl.jpg "Hosted by imgur.com")](http://imgur.com/6rHjSGP)

Now playlists of songs can be selected, that playlist can be navigated, and it can be paused (see mp3_task section). This takes five buttons. I dedicated two buttons to adjust the output volume, leaving 1 button remaining. The last feature I could feasibly add would be track seek. Instead of using two more buttons for seek forward and seek back (I didn’t have the buttons anyway) I changed the behavior of the next/previous buttons to be more dynamic. If one presses the next button momentarily then it skips to the next track. If one holds it down then it seeks forward until it’s released. This is intuitive for anyone who has used an digital audio player in the past decade, adds very useful and sometimes needed functionality, uses not a button more, and only added a dozen lines of code.

The thoughtfulness in the design process lends to the final product an intuitive and useful interface, something unheard of for a prototype class project.

[![](http://i.imgur.com/W8tdXpnl.png "Hosted by imgur.com")](http://imgur.com/W8tdXpn)

###Hardware Enclosure

Most students carry their PCB around in a antistatic bag or a cardboard box. Because I enjoy actually using my project as a functional audio player and I don’t feel complete without a complete product, I decided to design an enclosure. Adobe Illustrator is my preferred vector editor (I am accustom to adobe’s products from my photography background) and I designed it entirely using that program. I used a caliper to measure dimensions, acrylic from TAP plastics, and an Epilog Helix 60 watt laser cutter for cutting. The enclosure uses no glue and is held together entirely by friction from the interlocking pieces. I chose to design it this way since we’re using a development board that can (and will) be used for other purposes. It also reduces the bill of materials and minimizes cost by forgoing screws or glues.


### Task Breakdown

### void port_expander_task(void *pvParameters);

￼This is the simplest of the two main tasks. It has one public function, port_expander_task(), and controls the I2C port expander which has the 8 pushbuttons and 8 blue LEDs. Before it starts an endless for loop it initializes the led port as output. During the loop, which happens every 100ms, it polls the button port on the port expander and sends queue commands to the MP3 task based on which button was pressed and the duration held. One of the unique decisions in my design was to keep a variable with the previously polled port expander’s button port result. This allows for leading edge triggered and trailing edge triggered button behaviors. For example: when pressed momentarily then released, the NEXT button advances the playlist. However, when held for longer than 500ms it sends the seek command and when it’s released it resumes normal speed playback. This advanced button behavior is just 20 lines of code and allows for much more intuitive user operation.

The artist +- buttons send the MP3 task a playlist of an artist. This artists are stored on a linked list, and the nth member, n being advanced by the +- buttons, has a linked list of tracks which is sent to the MP3 task. This data structure and the playlist idea is covered in the mp3_task breakdown.

Finally, the last function of this task is to control the LEDs. There is a global data structure which contains the mp3_task status. When it is not playing an mp3 the LEDs only turn on with a button press, but when an mp3 is playing it animates the LEDs with a left-to-right back and forth pattern. This is accomplished using the variable i which is incremented with ever iteration of the for loop.

### void mp3_task(void *pvParameters);

The mp3_task is a beast of a task, with 8k of RAM allocated to it. It has many public functions, but the main one is the mp3_task.

Before the infinite for loop the task starts scan_root() which starts a recursive scan for every file on the card. When it finds a file that ends with .MP3 it reads the artist ID3 tag using the read_ID3_info() function I wrote (see writeup at tinyurl.com/t4-id3). It searches the artist_list for one with that title then prepends the track structure to it’s tracks list. With hundreds of songs and dozens of artists in many subfolders this function still only takes a fraction of a second.

The for loop starts next and the first thing it does is wait for xQueueReceive to get a playlist. Why playlist? When one chooses an artist and chooses a track they may navigate between any track, before or after the starting track. This also allows for  album playlists, genera playlists, and random playlists in the future. The playlist is just a Track pointer that points to a linked list of tracks.

To play a received playlist the task then loads the first item on the playlist, checks to see if it’s an mp3, and opens the file. It starts a while loop which reads a 4KB chunk of MP3 data from the file to a buffer then sends that chunk over SPI to the decoder. If, when reading to the 4KB file buffer, it reads fewer then 4096 bytes it ends this while loop, advances the playlist position counter, and it opens the file and repeats.

To pause playback the data transfer while loop is simply stopped by waiting for the RESUME status to be sent. If NEXT is sent then it will break; then advance the playlist. If PREV is sent then it does the same but decrements the playlist position counter. To fast forward and rewind the mp3 the f_lseek() function is used. It skips eight 4KB data chunks then plays one, making it an 8x seek.

### void sd_card_detect(void *pvParameters);

To handle the plugging-in and unplugging of the SD card without the need to restart, I’ve created a task that keeps notices plugging and mounts and unmounts it accordingly. It does this every 100 ms.

### void uartUI(void *pvParameters);

This task is massive and has lots of functionality. However, I will be brief since this is only a means to an end. The useful interface is the button task and in the future an LCD task or something similar. Tethering a device to a computer just to change tracks etc. defeats the purpose of having a mobile device in the first place. For development however it’s very handy.

This task provides a bash-like interface to administer the mp3 player. I’ve coded in bash-like cd, ls, and pwd commands that let one navigate the filesystem with relative pathnames, absolute pathnames, and optional arguments. One can also test crash the system, check the memory usage, check cpu utilization, and administer the spi flash memory module. I’ve made functions to load a file to a location in this spi flash module, to erase it, to scan it, to read from it, and to play an mp3 from it.

Before the endless for loop this task also plays a welcome mp3 from the spi serial flash memory. I think this is silly and counter-productive, but had to incorporate it to satisfy the requirement.

### Por Fin

This player is a great success. It’s something I’m proud of and have learned quite a bit creating. I’d like to take it further, creating an LCD interface, games, and album-art support. It would be great practice to port this to an STM32 ARM board which is more mainstream and slightly more powerful. One thing I wish we did would be design a PCB and fab our own board so we could make a marketable product. That would be a real top-down process of industry creation.

###Pictures

<div class="icontain i4x3"><iframe class="imgur-album" src="//imgur.com/a/I3DH2/embed?background=f2f2f2&text=1a1a1a&link=4e76c9"></iframe></div>

