---
layout: post
title: "CodeDaze 2018 Talk"
author: Chris Hartjes
date: 2018-10-18
comments: true
sharing: true
---

Back in September of this year had a chance to go *just* across the border into
the US to Buffalo, NY and speak at [CodeDaze](http://codedaze.me/), a conference
run by long-time devrel evangelist PJ Hagerty and some friends of his.

This year they had closed-captioning for the hearing impaired and they very
graciously have provided me with a transcript of my talk. I have cleaned
it up, edited a few things, and added some links to topics I spoke about.

Here's the talk:

Thanks.  Can everyone hear me
okay in the back with the mic, 
because I'm a very large human?  

Can you hear me okay in the 
back?  I also talk really loud.  

This talk is about how your 
tests won't save you. I'm going 
to talk about a set of 
complementary tools if you're 
working with a test-centric 
workflow.  Sorry for my thick 
Canadian accent. I hope the 
people doing the captions add 
the U's where they're supposed to 
be.  

I've been working for Mozilla 
about three years. I work with the 
Test Engineering group that 
tests every release of Firefox 
and associated services to make sure everything goes 
okay.  

I've been yelling at people 
about testing your PHP code 
since 2003.

This talk has no code or tests.  

You won't have to hurt your eyes 
trying to look at code.  It also
refers to tools from the PHP
world. If you 
know Perl or Ruby, it is 
close enough.  I'm describing 
practices that I think apply to 
projects where you'll have two 
or more contributors to it.

I'm 
going to talk about reducing 
what I see as a bunch of 
friction points in development 
and getting your application out 
into the real world.  You may 
look at something and go that's 
not a big deal, but when you 
have like 10 or 11 of these 
things, the idea of friction and 
the project keeps rubbing up 
against problems and pain points 
all the time, that will cause 
your project to lose velocity.  


You'll drop contributors.
You'll spend way more time 
trying to get your eyes out of 
your laptop.  

I have these 
features.  I want to share them 
with as many people as possible, 
so I have to find a way to get 
some velocity going.  

Thankfully for someone like me 
the value of automated test 
suites has been proven via 
studies. 

The [canonical study](https://www.infoq.com/news/2009/03/TDD-Improves-Quality)
was done by IBM and Microsoft.  
They got a bunch of teams 
together and said "okay, here's 
a problem we want you to solve. We want some of you to use test-driven development
and some of you to not".  

When I talk about test-driven 
development, we're talking about 
the Wikipedia-style definition 
where we're planning things with 
our unit tests.  We are planning 
functionality and behaviors.  
We're writing tests assuming 
that everything is working 
correctly, and then we write 
code until the tests pass.

Then 
we rinse and repeat until we get 
an application that is working 
the way we expect it to.  The 
results of that study were that for 
20% to 40% extra time that 
you'll spend writing your unit 
tests, you'll have 40% to 90% 
fewer bugs showing up in 
production.  If you're an 
evangelist for testing stuff 
like me and you want to lie -- 
well, not lie but exaggerate a 
bit to convince the people above 
you who give you permission to 
do things -- you tell them "for one 
	day a week we'll have 90% pure 
	bugs".  It's not true, but it is 
	a nice sound byte to tell 
	people.  There is definite value 
	in investing time to have 
	automated test suite.  

But tests only fix a small 
range of problems when you have 
a collaborative project.  
Because tests don't help with 
people problems.

That's what 
I've kind of discovered over the 
years.  The problem isn't the 
testing tools themselves 
anymore.

There was a time when I 
had to walk both ways uphill in 
the snow to get these things to 
work, but there's now testing 
frameworks for pretty much every 
single mainstream programming 
language you can think of, and 
there's plenty of examples on 
how to write tests and lots and 
lots of examples on philosophy 
and the ideas behind testing.

I 
write books about testing, so 
there's no shortage of 
information, but the problem is 
these are technology-based 
solutions.  As we all know, 
people are the worst, and people 
are the problem.  It's never the 
tools.  

So, if you're thinking the idea 
behind tests is "I'm trying to 
prevent bugs from reaching the 
users", there's this mythical 
thing that if I have tests, I'm 
going to increase the quality, 
whatever quality means, but my 
experiences have been
 
As an aside, I'm like Avdi (note, I am referring to [Avdi Grimm](https://twitter.com/avdi)).  I've 
been doing this for a long time.
This is my 21st year getting
paid to write computer programs.  

I got my first computer probably 
before a lot of people in this 
room were born.  I got a -- has 
anyone heard of the [Commodore 
Vic 20](https://en.wikipedia.org/wiki/Commodore_VIC-20)? 

I'm 47, which is 470 in 
internet years.  300 years I've 
had a computer, so I've been using computers for 
a long time.

I discovered the 
problem when you had to 
collaborate.  When it is just 
you working on this stuff, it 
doesn't matter.  But if you want 
someone else working on your 
project and you want quality code and 
as few bugs as possible, just 
having a test alone won't save 
you.

But we can address some of 
the people problems with some 
help from technology.  But 
technology is not the answer to 
all the people problems.  This 
is a blind spot that many 
programmers have that we're so 
enthusiastic about the work 
we're doing and technology and 
the promise of the future.

There's that old 
joke about "where the jet cars we were promised?!?".
If you're like me and you grew 
up in the 1970s and 1980s, we 
have the exact future we were 
promised, a corporate dystopia. It's the 
technology that's enabling 
people problems to be worse.  

Technology can't solve horrible 
people, but it can help to kind of 
smooth things out in your 
project.

So here's what I want 
to talk about.  What do I really 
think helps?  I want to talk 
about tools that can save us 
from thinking too much and tools 
that can save us from 
remembering too many things and 
tools that can save us from 
ourselves.

Because I know a 
current me is always cursing 
yesterday me for making a stupid 
mistake that was easily 
avoidable.  

What are some tools that can help 
save us from ourselves?  There 
are three things I want to talk 
about today.  I want to talk 
about build tools, code stylers 
and sniffers, and probably the 
most controversial tool because 
I think it is in really, really 
short supply these days: empathy.

Build tools: what they save us 
from is remembering error-prone 
sequences.  When you think about 
the modern web application -- I 
saw a joke that said PHP was the 
original serverless language.  


Those were the glory days of 
lazy developers where you didn't 
have to do much, but now pretty 
much any nontrivial web 
application has not only source 
code that you have to think 
about, but we're talking about 
databases, so we have migrations 
and database initializations.  
We have to compile assets.  


There's a bunch of different 
things you need to do so it is 
no longer just a case of I can 
take my source code and copy it 
somewhere.  Hopefully, you're 
not using FTP.  I know that's an 
old joke.  Please don't use FTP.
You're going to make it that 
nobody wants to work for you.  

You can't just copy your stuff 
up anymore.  As a result, we 
have all these other additional 
tools that we need to learn to 
use.  That is additional 
overhead and context switching 
that you need to do when you're 
working on stuff, so build tools 
can save us from that.  When I 
talk about build tools, there's 
a couple of things that come to 
mind.  

We can talk about a series of 
hand crafted shell scripts.
You're trying to 
take things you've been doing 
manually to deploy the 
application and get the computer 
to do it.

You'll start off with 
a shell script or we're manually 
typing in terminal shells.  You then move 
to some sort of tool that's tied 
to some sort of specific 
programming language.

On the 
PHP side of things, there's a 
tool called [Phing](https://www.phing.info/).  It uses 
XML to define things, so don't 
be scared of XML.  I used to 
work for a company that did 
nothing but XML.  All I did was 
lose my hair over it.  Don't 
worry.  

 Anyway, [Chef](https://www.chef.io/chef/) is 
 very tightly linked to Ruby.  We 
 move from the shell scripts to 
 language-specific tools.

 [Jenkins](https://jenkins.io/) is probably the most 
 popular one for people that want 
 to do it themselves.  At 
 Mozilla, we make heavy use of 
 Jenkins.  We have our own build 
 server, and what the build 
 server does is run our tests for 
 us.

The operations build tool will call 
 to our Jenkins instance and say 
 "we just did a deployment", and passes 
 in a bunch of information.  We 
 wrote some stuff in Jenkins to 
 parse tags. 

 I'm doing this
 project, and it is aimed at 
 staging or it is in  
 development or in 
 production.  Then Jenkins goes 
 and runs the test.

That is kind 
 of the sweet spot to be in 
 because what you want to get 
 away from is this idea that 
 whenever a deployment happens, 
 everyone has to be there just in 
 case something happens.  

I've worked at places where 
everyone stayed on a Friday 
until 10:00 p.m. just because 
there were any glitches.  We 
want to move towards this idea 
that deployments can be 
flawless.

People make mistakes, 
right?  Because computers are 
great at what we tell them or 
more accurately what we think 
we're telling them to do over 
and over again usually without 
complaining.

Hopefully, your 
computer doesn't complain to you 
when you try to get it to do 
something, but humans make all 
kind of mistakes because we're 
humans.  We're not beings of 
pure logic. We make mistakes.

We have unconscious biases. We 
understand that some parts of 
our application are kind of 
tricky, so we're reluctant to 
test them in the way that they 
need to be tested.  More 
importantly, we can fat-finger 
statements.

Imagine you have 
some deployment process that is 
32 steps long.  If you make a 
mistake at step 17 and don't 
realize until step 27 because 
you're seeing some weird error, 
this is a mistake, and it is 
kind of avoidable.  

 A build server is freeing up 
 mental energy for other tasks, 
 right? I find that as I age  my brainpower 
 gets less and less, so I want to 
 use my brain for other things -- I play that 
 expensive card game Magic the 
 Gathering.  I have this other 
 stuff rattling in my head that I 
 sometimes think is more 
 important than work, but if I need 
 to think about which of these 32 
 steps am I going to make a 
 mistake.  I want to free up 
 mental energy to actually solve 
 problems.
 
In the testing work I 
 do, there are some very 
	 interesting problems to solve, 
	 and I would rather spend the 
	 mental energy on that.  

How many people here have had 
experience using Jenkins or 
[Travis](https://travis-ci.org) for your projects?  A 
fair number.  For those who may 
have heard of it and never gone 
through it, here's a summary of 
how a build tool can be set up 
to help you.

Usually, the build 
tool is triggered by your 
version control system.  I hope 
everyone is using version 
control.  Again, we're at a 
point in time where it is super 
easy to use version control, so 
there's really no excuse not to 
use it.

It should grab a copy 
of your code, including the 
changes that you've just made.  
Then here's the important part 
-- we can save ourselves because 
it will build an environment.  
It is going to check out the 
code.  It is going to do any 
database migrations, anything 
else that you need done, warming 
	up caches and things like that.  
	You want the build tool to do it 
	because you don't want to be 
	babysitting these automated 
	systems.  If you can't trust the 
	automated system, you need to 
	fix it until you can trust it.  
	Then it runs the test, and it 
	will let you know what has 
	passed or failed, right?  

The build tools are going to 
save you from yourself, and the 
build tools are pretending to be 
you executing all these steps 
flawlessly, so again you save 
that mental energy.  You're not 
worrying at all about which of 
these steps am I going to have 
to remember.  

Also, using things like build 
tools will move you down the 
road toward continuous 
deployment.

What I mean is the 
idea is you want to have the 
deployments of your application 
a non-event.

* We deploy once very two weeks or once a month.  
* We never deploy on a Monday because everyone is pissed off because it is Monday.
* We don't deploy on Fridays because everyone is pissed off on Fridays 

You don't want that.

I have seen places that have 
made this work, but they're not 
large places with tons of 
engineering resources.  There's 
a web page and someone presses a 
button that says deploy.  That's 
it.

For me personally, the [Holy 
Grail](https://en.wikipedia.org/wiki/Holy_Grail)
 for this is every single 
change you make through a system 
of automated systems goes up 
production.  If the tests pass 
up in production, it goes.  You 
want to be able to deploy 10, 
15, 20 times a day.  It should 
be literally a nonevent.  It 
should be sending off a tweet.  

Another tool that I think helps 
reduce our cognitive load and 
gets rid of friction are code 
stylers and sniffers.

[Colin](https://twitter.com/colindean)'s 
talk on code reviews, a lot of 
what he talked about really 
resonated with me, but he didn't 
get into the downside or maybe 
he did because I was too busy 
making notes.

We start arguing 
about how things look, what the 
variable was named, especially 
in PHP because it is so flexible 
with the syntax.  Why is the 
curly brace there?  Why are 
there extra spaces before the 
variable name?  We know that we 
don't use private class 
attributes.  They should be 
protected or public.

People are 
arguing over how it looks 
instead of the point of the 
review, which is supposed to be 
"is this code behaving the way 
that I've said it is behaving".  

Is it solving the problem it is 
supposed to be solving?
Instead, we're relying on a 
third party.  It is not 
necessarily arbitrary because 
oftentimes you can go and give 
the code sniffer and styler your 
own ideas on how you want things 
to look.  

The project that I work on on 
the PHP side of things is called 
[OpenCFP](https://github.com/opencfp/opencfp).

The best way you can 
describe it is a competitor for 
[Papercall](https://papercall.io).

I used to run a 
conference up in Toronto called 
TrueNorthPHP, and I needed a 
tool to collect papers from 
people who wanted to speak.  I 
wrote something.  I thought I 
might as well open source it so 
I can fix the bugs and weird 
behavior that must come up.  
There must be 30 or 40 
conferences that use open CFP.  
We love it. 

(At this point I was talking about [PHP Codesniffer](https://github.com/squizlabs/PHP_CodeSniffer)
but the captioning folks couldn't make out what I was rambling about)

What can this tool do for us to 
reduce arguments in code 
reviews?  It checks are we using 
the correct array syntax for the 
newer versions of PHP.  We look 
at tools about line spacing to 
make the source code a lot 
easier to read.  We have a thing 
that checks if there is a test 
attached to it.  If you have a 
class named a certain way in a 
specific namespace, we have a 
specific test.  We look for 
return-type declarations.

PHP 
has type hints for parameters 
and return values.  If you 
haven't looked at PHP in the 
last four or five years, I don't 
blame you for not knowing what has changed.  Now it is a modern 
oriented language with a lot of 
cool features.  PHP powers about 
half the web.  Wikipedia runs on 
it, WordPress.  So much web 
content is served on PHP.  

We are slowly moving towards 
static types or Java with dollar 
signs on the front, but these 
are all things it checks.  

There's another 50 things we 
look for.  These are all things 
that we found we were arguing 
about all the time or things 
that were being adopted as best 
practices by other PHP projects.  


If we agreed with it, we would 
just add a line or a line or two 
of configuration to the code 
sniffer and then we would look 
for these things.  We wanted 
	consistent enforcement of these 
	style rules.  We didn't want it 
	to be that I could do things one 
	way and someone could do things 
	a different way.

Al those arguments just disappear because 
we decided on a set of rules 
that said we have this tool.  


 I don't know about you, but if 
 I look at code bases, you kind 
 of learn the general style 
 that's applied to it.  When you 
 see something that doesn't match 
 that style, when it is late on a 
 Thursday and you're thinking 
 you're going to go out and have 
 dinner and your eyes are glazed 
 over and you can see the 
 indentation patterns, some of 
 that doesn't look the same as 
 the rest of the code stands out 
 at you automatically.

It is a 
	 little tiny friction point.  


 This does not look like the rest 
 of the code.  Now I have to stop 
 and process and say why is this 
 different.  Maybe there's 
 nothing wrong with it.

Maybe 
	 they just like to name variables 
	 differently or they added an 
	 extra line of indention.  
	 Sometimes it is a structural 
	 problem, like you didn't even 
	 run this code before hitting 
	 execute.

This is all about 
	  mental energy.  We're 
	 trying to save our -- this is 
	 all about trying to save our 
	 mental energy.  

There is no flexibility or room 
to disagree.  The code sniffer 
said this was a mistake.  In 
OpenCFP, the code 
sniffer finding a problem is 
considered a failed build.  You 
have to go back and fix it.

You 
can run the code sniffer, and there 
are some types of errors it can 
fix for you.  It will add in 
declarations if you're missing 
them and return-type hits, 
indents.  It will fix a bunch of 
things so I don't have to go 
back and fix them myself.  

 Some other languages are 
 starting to provide automated 
 formatting and sniffer.  My 
 apologies if I don't use 
 anything that's in widespread 
 use anymore.  Go uses goformat.  
 Python created these standards called PEP8 
 of things they wanted people to 
 do with the language and with 
	 the community and stuff like 
	 that, so there's several command 
	 line tools that will scan your 
	 code and say, hey, it violates 
	 this rule and this rule.  Do you 
	 want to fix it?

I found this called Rubocop
	 for Ruby.  I don't know if 
	 Rubyists use it.  The Ruby I 
	 have looks pretty clean and 
	 consistent across projects.  
	 Maybe code formatting isn't a 
	 problem.  Between PHP code 
	 sniffer and Python, I don't have 
	 to worry about it.  I take 
	 advantage of these sniffing 
	 tools and styling tools in order 
	 to eliminate remembering what 
	 code should look like.  

(After my talk I was approached by a Rubyist who
went on an extended rant about all the things
they disliked about Rubocop.)

This is the last one.  Then I 
will be just about done.  

Empathy.  This is a tricky one 
because empathy is the most 
difficult tool of all to 
implement for a project because 
there is a quite large group of 
people who think empathy has no 
place in programming.

I like to 
call it the lie of the 
meritocracy.  No, it is not a 
meritocracy.  A lot of it is 
about how you know and how long 
you've been doing certain 
activities.  Your technical 
brilliance won't enough to 
advance you through your career.  

As [Emily](https://twitter.com/editingemily) said, a career is a 
marathon.  It is not a sprint.  
I've done this long enough to 
understand, yes, this is a 
marathon.  I need to grind 
things out to get the victories 
that I want.

Empathy is the 
thing because if you got into 
programming -- you figured it 
was a good way to avoid dealing 
with people and talking to 
people.  You talk to your 
computer.  Unless you're having 
some mental health issues, the 
computer shouldn't be talking 
back to you without you expecting to, so you're thinking 
it will be great.

I'll just sit 
somewhere.  They'll give me work 
to do.  I'll do my work, and 
then I won't have to talk to 
people.

You're going to be 
extremely disappointed.

If 
you're trying to move from 
programming as a job to 
programming as a career, 
programming as a job is about 
solving specific problems.  
Programming as a career is about 
collaborating with a bunch of 
people to solve problems.  

I know people watching up here 
might be surprised to know when 
I first started giving talks I 
was terrified to be up on stage.  


In high school, I was the person 
with a sheet of paper up at the 
front doing the speech and the 
paper shaking and stuff.

When I 
went to college during medieval 
times, we did a mandatory course 
on presentations.  I don't know 
what that teacher did, but he 
aligned all the right switches 
in my head where I could 
suddenly give talks.  I didn't 
matter if it is 3 people or 
1,000 people.

It's about 
communication and collaboration.
Once I figured that out, the 
career took off.  I've been 
speaking at conferences since 
2004.  I think if I didn't learn 
that collaboration and empathy 
was the way forward, none of 
this stuff would have happened 
for me.  

Things turned very toxic 
easily.  Programmers argued 
incessantly about little 
details.  I think empathy is 
your best weapon against 
toxicity in your project.  When 
I talk about empathy, I'm 
talking about this idea -- a lot 
of people have a problem with 
this, the ability to understand 
other people are not like you.  

When you hear discussions with 
people going "I don't understand 
how person X can do activity Y"
-- you need to understand other 
people's point of views.  You 
need to understand how and why 
people react to certain things.  

In programming, I think this is 
very critical because you really 
do need to understand that 
	everyone does not think like 
	you.

Because if you can 
	understand how people are going 
	to react to what you're doing, 
	it allows you to anticipate 
	reactions and head off potential 
	problems within your project.  

Anyone who has done any type of 
testing for a little bit 
understands that even today it 
is still quite a contentious 
subject with lots of people not 
understanding the value.

Why do 
you want to spend this time 
writing tests?  Why do we want 
to spend time investing in 
learning how to use these tools 
and frameworks?  It's because 
it's been proven that it works, 
but people want to argue about 
it.

When you start testing your 
code, it will change how you 
write your code.  You have to 
write code in a specific way to 
take advantage of testing tools.  
At the unit level anyway.  

People don't like being told you 
need to change something that 
you think you've been successful 
at in the past.  

I'm not immune to this.  I 
don't always like being told I'm 
wrong.  Some people won't 
change.  This is an interesting 
thing I've found.  People like 
to change what they use but not 
how they use it.  What I mean by 
this is there are many, many 
programmers who are always 
chasing the new and shiny 
tool.

Five more minutes?  I'm 
almost done.  

They want to change to the 
newest framework for their 
programming language or the 
newest tool.  They don't like 
being told you need to change 
how you're using it because how 
you're using it doesn't lead to 
good outcomes.

People don't 
like this, so it generates toxic 
people from people who don't 
want to change.  It might have 
been short-term success, but 
long term and medium term it is 
not going to work.  

Toxicity drives away people 
from projects.  Sometimes I lack 
the skill to execute on the last 
10% on a particular problem.  I 
want to draw people in who are 
interested in collaboration and 
interested in solving problems.  

If I want to continue to have 
access to people like that, I 
can't have toxic communities.  I 
can't have people insulting 
people on threads and GitHub and 
Twitter.  I clamp down on that 
shit.  It's not going to push my 
stuff forward.  

I told people the reason I 
don't go into management after 
all this time is because I have 
two kids that I do enough 
managing at home that I don't 
want to manage other people.  I 
know the millisecond I step out 
the door I hear my kids start 
arguing with my wife.  

Your career will depend on 
working with others.

We're just 
about done.

Your testing 
framework won't save you from 
problems because it is simply 
not enough.

You should use 
build tools because they protect 
you from performing complicated 
stepping manually.

You should 
be using code sniffers and 
stylers to protect from you 
arguments.

Empathy protects 
your project from being toxic.  

I do Twitter performance art as [grumpyprogrammer without the u](https://twitter.com/grmpyprogrammer),
I sell books on my [website](https://grumpy-learning.com) and

I have a conference coming up 
next year, so please support my 
efforts so I can continue to 
come to conferences and not have 
my employer complain about it.  

Thanks very much.  

