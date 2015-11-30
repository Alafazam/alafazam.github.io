---
layout: post
title: "Lightweight C MP3 ID3v2 Reader"
tags: [github, projects, embedded]
---

Super lightweight MP3 ID3 metadata tag reader made for embedded systems.

Now [on GitHub!](https://github.com/t413/read_ID3_info)

### Background

I'm writing a full-featured mp3 player for the SJSU class CMPE 146, Embedded Microprocessor System Design, that runs on the [LPC2148 ARM7 Board](https://www.sjvalley.com/shop/index.php?page=shop.product_details&flypage=flypage.tpl&product_id=27&category_id=1&option=com_virtuemart&Itemid=63&vmcchk=1&Itemid=63) from sjvalley. The project is running RTOS and has reads files from a SD card streams them through an MP3 decoder to a DAC and finally your headphones.

The project is coming along nicely but I wanted a way to read ID3 tags so read_ID3_info() was born.
<!--more-->

### Alternatives

The implementations for c/c++, according to [http://www.id3.org/](http://www.id3.org/) are thus:

*   [TagLib](http://www.id3.org/TagLib) Audio Meta-Data Library - modern implementation with C, C++, Perl, Python and Ruby bindings. [http://developer.kde.org/~wheeler/taglib.html](http://developer.kde.org/~wheeler/taglib.html)
*   [ID3Lib](http://id3lib.sourceforge.net/) on Sourceforge. The source code is coordinated by Scott Haug and was initially written by Dirk Mahoney and Andreas Sigfridsson.
*   [libid3tag](http://www.underbit.com/products/mad/)

Each of these libraries were too large and complicated to run on an embedded system although they offered many cool features. The library I've written is just one function, read_ID3_info(). It works well on my desktop and on my LPC2148 ARM7 board using [FatFs](http://elm-chan.org/fsw/ff/00index_e.html) from [elm-chan.org](http://elm-chan.org/).

### Implementation

Here's an example for running on the LPC2148 ARM7 board using FatFs functions:

{% highlight c linenos=table %}
FIL file;
f_open(&file, file_name, (FA_READ | FA_OPEN_EXISTING));
char str[40];
read_ID3_info(TITLE_ID3,str,sizeof(str),&file);
printf("Title: %s\n",str);
f_close(&file);
{% endhighlight %}

For running on a desktop I made a demo program which is now also in the github project.

You can run the test program, read_id3, with a mp3 file as an argument. You may also run it with a directory as an argument and the program will scan that directory for any .mp3 files and list the info on them.

### Feedback

I've spend many a night on a [hex editor](http://ridiculousfish.com/hexfiend/) and [id3.org](http://www.id3.org/id3v2.4.0-structure) writing this and I hope it helps out at least someone. If anyone has any suggestions, finds any bugs, or comes up with an especially cool use for it I'd like to hear about it (yes, even the bugs). File a bug [on GitHub](https://github.com/t413/read_ID3_info) and/or [send an email](mailto:timo@t413.com).

### License / Copyright

This work is licensed under the Creative Commons Attribution-ShareAlike 3.0. See source code comments for details. I'm flexible if this is incompatible with your needs, just email me and ask.
