---
layout: post
title: "Console Based Quiz App in Node.js"
tags: [nodejs,node,readline,colors]
---


In this post I will teach you to make a console based Quiz app in Nodejs.
<!--more-->


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


#### Readline sync

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


This looks very messy, we should fix it.
String-format module comes in handy here.

#### String-format

It Adds a format method to String.prototype. Inspired by Python's str.format(). Wow

 For example:

{% highlight javascript %} 
'"{firstName} {lastName}" <{email}>'.format(user)
// => '"Jane Smith" <jsmith@example.com>' 
{% endhighlight %}

The equivalent concatenation:

{% highlight javascript %} 
'"' + user.firstName + ' ' + user.lastName + '" <' + user.email + '>'
// => '"Jane Smith" <jsmith@example.com>' 
{% endhighlight %}


String::format can be used in two modes: function mode and method mode.

#####Function mode

{% highlight javascript %} 
format('Hello, {}!', 'Alice')
// => 'Hello, Alice!' 
In this mode the first argument is a template string and the remaining arguments are values to be interpolated.
{% endhighlight %}

#####Method mode

{% highlight javascript %} 
'Hello, {}!'.format('Alice')
// => 'Hello, Alice!' 
{% endhighlight %}

In this mode values to be interpolated are supplied to the format method of a template string. This mode is not enabled by default. The method must first be defined via format.extend:

{% highlight javascript %} 
format.extend(String.prototype)
{% endhighlight %}

#### Code 
Using this in our code



{% highlight javascript %} 
var readlineSync = require('readline-sync'),
	format = require('string-format');
format.extend(String.prototype);

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
    console.log('Yes, correct answer is {correctAnswer} method'.format(question));
} else {
    console.log('No, correct answer is {correctAnswer} method'.format(question));
};


function ask(ques) {
    return '\n{question}:\nA : {options.0}\nB : {options.2}\nC : {options.2}\nD : {options.3}\n'.format(ques);
}
{% endhighlight %}

Adding array for questions and keeping score of right answers we get:

{% highlight javascript %}

var readlineSync = require('readline-sync'),
    format = require('string-format'),
    chalk = require('chalk').styles;

format.extend(String.prototype);

questions = [{
    'question': 'In Java, Which method must be implemented by all threads?',
    'options': ['wait()', 'start()', 'stop()', 'run()'],
    'correctOption': 'd',
    'correctAnswer': 'run()'
}, {
    'question': 'In Java, What is the default priority of a thread?',
    'options': ['5', '10', '0', '15'],
    'correctOption': 'a',
    'correctAnswer': '5'

}]

var answers_right = [];
var answer_by_user = [];
var right_answers = 0;

for (var i = 0; i < questions.length; i++) {
    answer = readlineSync.question(ask(questions[i], i + 1), {
        limit: ['a', 'b', 'c', 'd']
    });
    answer_by_user[i] = answer;
    if (answer == questions[i].correctOption) {
        answers_right[i] = true;
        right_answers++;
    } else {
        answers_right[i] = false;
    };
}

console.log('\nYou got ' + right_answers + ' / ' + questions.length + ' correct \n');

console.log('Right option \t\t Your answer \t\t status');

for (var i = 0; i < answers_right.length; i++) {
    console.log(questions[i]['correctOption'] + ' \t\t\t ' + answer_by_user[i] + ' \t\t\t '+ answers_right[i] );
};

function ask(ques, i) {
    return '\n' + i + ': {question}:\na : {options.0}\nb : {options.2}\nc : {options.2}\nd : {options.3}\n'.format(ques);
}

{% endhighlight %}


######Coming up in Next blog.
Reading questions from a file, adding colors and publishing results in csv file.

