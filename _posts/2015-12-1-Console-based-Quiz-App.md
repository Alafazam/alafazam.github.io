---
layout: post
title: "Console Based Quizz App in Node.js"
tags: [nodejs,node,readline,colors]
---


In this post I will teach you to make a console based Quiz app in Nodejs.


### Initial Setup
Of course, the first thing you need to do is get NodeJS installed on your system. If you are a Windows or Mac user, you can visit [nodejs.org](nodejs.org) and download the installer. If you instead prefer Linux, I'd suggest that you refer to this [link](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

You also need to install readline-sync, chalk and string-format modules.
Lets's first make a package.json file. In an empty directory, create a package.json file with the following content.

{% highlight json %}
{
    "name": "Node Quiz",
    "version": "0.0.0",
    "description": "simple console based quiz app",
    "dependencies": {
        "readline-sync": "latest",
        "string-format": "latest",
        "chalk": "latest"
    },
    "author": "developer"
}
{% endhighlight %}

Now install all these simply by:-

{% highlight jade %}
npm install
{% endhighlight %}


