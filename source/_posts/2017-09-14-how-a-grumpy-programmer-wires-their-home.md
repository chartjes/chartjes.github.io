---
layout: post
title: "How a Grumpy Programmer wires their home for internet"
author: Chris Hartjes
date: 2017-09-14
comments: true
sharing: true
---
Back at the beginning of August my long-suffering wife and I packed
up our possessions and moved almost 2 hours away to a small village
of ~2500 people into a house on a street that doesn't seem to show
up on a lot of major GPS systems. Luckily it shows up both on Apple
and Google maps, and there is a [Tim Hortons](https://en.wikipedia.org/wiki/Tim_Hortons)
close by to act as a known landmark and guide people in.

With the move came an opportunity to Do Something Different with the
home wireless setup. In the past, I used a good, consumer-grade home
wireless router and it was usually good enough. Sometimes my oldest
daughter (her room was the furthest away from the wifi router) would
complain about poor signal, so I bought some [wifi extenders](http://www.tp-link.com/us/home-networking/network-extenders/range-extenders)
and those did the trick.

So this sort of thing was great...but I felt like I was not prepared
for the near-future, which is a home filled with all sorts of devices
that will connect via wifi to do things. I got a [Nest thermostat](https://nest.com/thermostats/nest-learning-thermostat/overview/) and was going to have an [awesome TV](https://www.amazon.com/dp/B06Y6FSV5Q/?tag=thewire06-20&linkCode=xm2&ascsubtag=AgEAAAAAAAAAAMEe) that needed a network connection. I also would have an older [Roku](https://www.roku.com)
device that would want to be on the network. Not to mention my own
devices for work...and my wife's iPad and iPhone...and devices my
kids were going to be using.

In short, I wanted to future-proof my network somewhat and try and
anticipate an explosion of devices that would need to be connected
to it. Yes, I am aware of some security implications and I am going
to be working on minimizing the exposure these things will have to
my network.

At some point I came across Troy Hunt's great blog post explaining
how he [helped wire his brother's home](https://www.troyhunt.com/wiring-a-home-network-from-the-ground-up-with-ubiquiti/)
with some great networking hardware. I clearly am not re-inventing
the wheel here -- Troy's template is one that I would absolutely
follow...if you have the ability to run wires in your home.

In my case, it was not going to be a problem. The previous owner had
been using VoIP for their phones so there were already several wired
connections backed by cat5. I was going to need some other lines run
throughout the house but it was not going to be an issue.

So I ended up with most of the hardware Troy recommended in his blog
post:

* 7 in-wall 802.11ac access points throughout the house
* 1 24-port Power-over-ethernet switch 
* 1 security gateway device that I am slowly learning how to configure correctly
* 4 cat5 connections for the access points
* 3 cat6 connections for the other access points
* 6u server cabinet (helpfully mounted on the wall) for all the equipment

I kept my existing [wifi router](https://www.netgear.com/home/products/networking/wifi-routers/R6400.aspx),
converted it to an access point, and plugged
it into the switch because my youngest's Netbook refused to connect to the new hardware.

But why go to all this trouble and expense (it cost me CDN$2k for hardware and another CDN$1.5k for the cabling work) for
my home network? Flexibility. This setup will be great for as long as gigabit
ethernet remains faster than anything I can get at my home. Right now our
[local internet provider](http://quadro.net) provides me with 50Mbps down / 5 Mbps
up over coax -- the modem is mounted on the wall next to the cabinet.
At some point they will be upgrading connections around here -- less than 1km 
away they are building a brand new subdivision with gigabit fiber being run to
homes. When the time comes, I'll just have to update the modem...and nothing
else. Maybe at some point [Ubiquiti](https://www.ubnt.com) releases some nicer in-room access points.
I can just swap my old ones for the new ones and everything else will just still
work great.

Each room has an access point now that covers a small area. The equipment smoothly
handles transitions from one location to another, and I can get to see some
cool reports about who is doing what (how much is my youngest watching YouTube?!?)
and adding and removing hardware for this setup is easy.

I highly recommend this type of setup for your home:

* centralized location of a switch near where your modem / internet connection enters
* wired connections to multiple locations, terminating near the switch
* in-wall or very small, unobtrusive access points

I realize not everyone can do this -- apartments and older homes make this very
impractical. I would recommend looking into mesh networks (Ubiquiti's consumer
line of Amplifi look really good) to give yourself sufficient capacity. The
number of network-aware or even network-required devices is only to go up, not down. If you can get out in
front of it a little bit you'll be in a great spot to take advantage of it.

