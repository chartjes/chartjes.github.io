---
layout: post
title: "From macOS to Windows 10 - Part 1"
author: Chris Hartjes
date: 2016-11-10
comments: true
sharing: true
---
Those who follow me on [Twitter](https://twitter.com/grmpyprogrammer) noticed
a tweetstorm about my unhappiness regarding the news of Apple updating their
line of laptops. I've been using Mac laptops for almost 13 years now (I'm
on my third one personally and used ones provided by employers), I own an old
iPad 3 and are on my 3rd iPhone (4S, to 6, to 6S+).

I was not impressed at all by Apple's offerings. I am currently using a mid-2012
MacBook Air. I have been happy with it but it no longer fits the needs of the
type of work I do. I need to use [Vagrant](https://www.vagrantup) and [Docker](https://docker.io)
and they like having lots of memory. 8GB just isn't enough to run virtual machines
and containers and modern web browsers and whatever other applications I need
open to do my job.

But the price of the latest Apple offering has jumped immensely. To buy a new
MacBook Pro with 13" screen, the OLED touch bar, 16GB of RAM,a 512GB SSD drive, and AppleCare will cost me
about CDN$3200 including taxes. Holy crap that is a lot of money. When I bought
my MacBook Air I payed just a little under CDN$2000 and felt I got a good
price.

Now, some of my friends have quite correctly pointed out that this is a device
that I will use every day to make myself a lot of money. I cannot argue with
that but I can state that I feel like that is an awful lot of money. But that's
not what really bothered me.

What bothered me was a feeling that Apple no longer cares about the group of
customers that I belong to -- the web developers who adopted their hardware
in droves and recommended it to all their non-technical friends. Heck, even
my mother bought a Mac after me telling her she'd have a lot less headaches.

So that got me to thinking -- could I do my job on a Windows laptop? To get this
out of the way, I won't switch to Linux. I need to record my half of podcasts
and want to create screen casts for my [side gig](https://grumpy-learning.com).
Doing that on Linux just isn't feasible.

Now, I also want a laptop with some of the same aesthetics as a Mac one -- the
hardware needs to look nice and feel like the company that made it actually
cares how everything goes together. I could easily go with a more utilitarian
PC laptop. I don't want to.

So I took a look at the new Surface Book from Microsoft. In the wake of some
recent hardware announcements it looks like they have been paying attention
to how Apple's line of laptops and desktops has been are changing and are
making a play to get more developers back to using their hardware.

The Surface Studio looks amazing. The Surface Pro looks like a weird hybrid
tablet and computer. But the Surface Book looks...very enticing.

I have considered it even with costing about $200 more than a similarly-equipped
MacBook Pro. It has a touch screen and the screen itself detaches for use
like a tablet. My old iPad is showing it's age and I would love a tablet that
is responsive and bigger than my iPhone 6S+.

So at TrueNorthPHP 2016 I managed to play around with one of the older generation
Surface Books that [Elizabeth Smith](https://twitter.com/auroraeosrose) uses.
It reminded a lot of a MacBook. The detachable screen is incredibly light.
I was starting to think "this could work".

Luckily for me, my friend Mickey MacDonald from Microsoft has hooked me up
with a 30 day loaner of a Surface Book with 16GB of RAM and a 512GB hard drive.
I'm going to take one of these for a spin and see if I like it enough to
plunk down some money for one of my own.

I got a few days ago and have just started trying to configure it the way that
I need it to be. I want to share some of these early thoughts.

## Operating System Choices

Yes, I remember how much better OS-X was than previous versions of Windows.
Now, I'm just not sure it matters to me. I'm not a power user of any of my
systems any more. I prefer a stable experience. Yes, I've used Windows 10
recently -- my wife and oldest daughter have laptops with it on it. To me,
it's not a problem.

I also ran Windows 10 for a while via Bootcamp on my MacBook Air. Again, I
didn't have any problems. It worked fine. So the OS won't be the issue.

## Linux/BSD underneath

Now, *this* could be a problem. Luckily it seems I can get a nice Bash shell
and a flavour of Ubuntu that works. [Windows Subsystem for Linux](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux) provides
me [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) along with all the Ubuntu tools I expect (like apt-get).
After doing the Windows update dance I was able to get it up-and-running with
no problems. I haz Bash now.

## Hybrid Approaches

After seeking some advice from my fellow PHP developers who use Windows
full-time it was suggested I use a hybrid approach. First, I should use Bash
for everything I normally use the terminal for on OS-X. This means 99% of the
time I'm doing stuff in Python with [pytest](http://docs.pytest.org/en/latest/).
I did check out some of my work-related code and got it working. Again, that
won't be an obstacle.

I was then told to store my Linux-related stuff not in /home/chartjes but in
on the C drive. This is so that the Windows apps I would use (like [Atom](https://atom.io))
would be able to read the files there. This makes total sense to me, and it
worked like a charm.

To be clear, it's still very early days. But I feel like I've passed the first
hurdle. I have installed a VPN client so I can connect to things at work, and
next up will be to install some other tools I need (like our [video conferencing software](http://www.vidyo.com/)).

This weekend I plan on spending some time using the screen in tablet mode. The
Surface Book came with a pen, so it should be interesting to see how that works
in conjunction with the touch screen.

Next week I'll have another update about actually using it for work!
