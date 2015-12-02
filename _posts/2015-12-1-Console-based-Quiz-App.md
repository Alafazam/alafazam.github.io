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

Now to begin, you must know what readline module does.

#### ReadLine

This is the most simple example of Readline

{% highlight javascript %}

var readline = require('readline');
 
var rl = readline.createInterface(process.stdin, 
     				  process.stdout);
 
rl.question("What is your name? ", function(answer) {
    console.log("Hello, " + answer );
    rl.close();
});

{% endhighlight %}

What does it do? We include the module, create the Readline interface with the standard input and output streams, then ask the user a one-off question.
and print his answer. 
{% highlight javascript %}
rl.close()
{% endhighlight %} 
This method closes the connection between readline and console. Becasue of this, it is a bit tedious to use simple async readline here.
So we will use sync version of Readline named Readline-Sync


####Readline sync

Synchronous Readline for interactively running to have a conversation with the user via a console(TTY).

{% highlight javascript %}
var readlineSync = require('readline-sync');
 
// Wait for user's response. 
var userName = readlineSync.question('May I have your name? :');
console.log('Hi ' + userName + '!');
 
// Handle the secret text (e.g. password). 
var favFood = readlineSync.question('What is your favorite food? :', {
  hideEchoBack: true // The typed text on screen is hidden by `*` (default). 
});
console.log('Oh, ' + userName + ' loves ' + favFood + '!');

{% endhighlight %}

Output

{% highlight Bash%}
May I have your name? :CookieMonster
Hi CookieMonster!
What is your favorite food? :****
Oh, CookieMonster loves tofu!
{% endhighlight %}

you can find more about it here [readline-sync](https://www.npmjs.com/package/readline-sync)


##### Code
Now all we need to do is have a set of questions and syncronosly ask them to user.
Here is how we are going to do that.

{% highlight javascript %}
var readlineSync = require('readline-sync');


questions = ['May I have your name? :', 'What is your favorite food? :'];


for (var i = 0; i < questions.length; i++) {
    
    answers = readlineSync.question(questions[i]);
    console.log(answers);

};

{% endhighlight %}

But we also do need to provide options to users, don't we.
May be we can limit key press input by user, gladly readline-sync can do this for us.
Our code becomes

{% highlight javascript %} 

var readlineSync = require('readline-sync'),
    util = require('util');

question = {
    'question': 'In Java, Which method must be implemented by all threads? :',
    'options': ['wait()', 'start()', 'stop()', 'run()'],
    'correctOption': 'D',
    'correctAnswer': 'run()'
}


answer = readlineSync.question(ask(question), {
    limit: ['A', 'B', 'C', 'D']
});

if (answer == question.correctOption) {
    console.log(util.format('Yes, correct answer is %s method', question.correctAnswer));
} else {
    console.log(util.format('No, correct answer is %s method', question.correctAnswer));
};


function ask(question) {
    return util.format('\n%s:\nA : %s\nB : %s\nC : %s\nD : %s\n', question.question, question.options[0], question.options[1], question.options[2], question.options[3]);
}


{% endhighlight %}




