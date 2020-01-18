---
layout: post
title: "Web Acceptance Tools Suck"
author: Chris Hartjes
date: 2014-10-31
comments: true
sharing: true
---
Wow. Almost a whole year since I posted something. Time to change that.

It is not a coincidence that I write this blog post on Halloween 2014. Because
I want to talk about something that should make your skin crawl and want to 
turn all the lights on in the location where you are reading this.

I am talking, of course, about writing automated web acceptance tests.

At ZendCon2014 I did a talk about how to use [Behat](http://behat.org) and
[Mink](http://mink.behat.org) to write some automated acceptance tests for
your web sites. You know, the type of thing where you drive a browser using
some code and it pretends to click on things...and you lie to yourself about
what value all this work is giving you.

I also made the classic mistake of waiting too long to go over my slides for
this talk and realized I was using versions of these tools that were extremely
out of date. I then spent 6 hours updating the code, instead of watching my
friends give awesome talks about PHP and complementary technologies.

This sucked. Sucked big time.

As far as I can tell, we are currently at the point in the PHP community with 
these tools like unit testing tools were 10 years ago when I first decided I
needed to find ways to never work 120 hours of overtime in 6 weeks leading
up to Christmas ever again.

Behat and Mink are both very powerful tools, but their documentation is
lacking and the code samples review what I think is a very large disconnect
between how the creators of these tools use them and how the rest of us use
them. I have no idea if there is even any blame to be handed out, unless you
subscribe to the theory that shitty documentation is the fault of the people
who created the projects in question.

I am not diminishing the work of those who created these things. They are
great programmers, and I am just a grumpy guy who wants things to work a
certain way and not act like obstacles. I like my tools to be complementary
and easy to figure out how to bend to my will.

But when I look at how brittle these things are, and how slow they are, it
makes me wonder if I wasted my time learning how to use them.

For those who don't understand what I am getting at, or think I am acting like
the drama queen they secretly hope I am, consider this -- the best way to
identify elements on a web page is to use tools that expect you to either
fully understand CSS and also how XPath works.

Folks, this is a shit show.

Now, it is entirely possible I am simply Doing It Wrong, and will be happy
to be corrected. Take a look at the code in [this repo](https://github.com/chartjes/wat-zendcon14)
AND DESPAIR. This code is brittle, has to maintain state between test steps
manually, and the tests take forever to run because you have the overhead
of starting up a browser and painfully crawling through the DOM to find things.

(By the way, who is the person that decided the DOM was the best way to internally
represent elements on a web page? If it was Tim Berners-Lee, well, it strikes me
as a decision that is biting us in the ass now but was probably totally logical
at the time)

I am hopeful that someone out there is working on a better set of abstractions
and tools that will make the types of things we are asking Behat and Mink and
Page Objects and PhantomJS to do a lot better.

Send me your thoughts and ideas on Twitter or to chartjes@grumpy-learning.com
and I will do a follow-up post.
