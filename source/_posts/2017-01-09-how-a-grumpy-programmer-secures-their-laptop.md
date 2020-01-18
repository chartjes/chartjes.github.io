---
layout: post
title: "How A Grumpy Programmer Secures Their Laptop"
author: Chris Hartjes
date: 2017-01-09
comments: true
sharing: true
---
On the [/dev/hell podcast](https://devhell.info) episode I recorded with [Ed](https://twitter.com/funkatron)
last night, I got the chance to talk at length about my early experiences with
my new laptop. According the 'About This Mac':

* MacBook Pro (13-inch, 2016, Four Thunderbolt 3 Ports)
* Processor 2.9 GHz Inetl Core i5
* Memory 16 GB 2133 MHz LPDDR3
* Startup Disk Macintosh HD
* Graphics Intel Iris Graphics 550 1536 MB
* Pretentious Level High

Thanks to a focus by Apple on People Not Like Me, I was able to get up and
running really quickly on my new laptop. The Migration Assistant worked
perfectly except for not copying over some saved game files for a Steam
game that I play quite a bit ([Football Manager 2016](https://en.wikipedia.org/wiki/Football_Manager_2016)).
Especially when I have a setup that requires the use of SSH keys and applications
all configured to my liking, this was awesome.

My next thought turned to security. Clearly we are in a era where attempts to
access people's computers is on the rise. Not that I am thinking I am the
target of a shady cabal of l33t hax0rs being paid by shadowy security forces
of governments that don't like my politics, but I want to at least make them
work a bit. So I want to share what I decided to do.

I've been using [FileVault](https://en.wikipedia.org/wiki/FileVault) for a long
time (in fact, it was a requirement for me if I wished to use my own equipment
while working for Mozilla).

After that, you have all sorts of options. After seeing a Tweet from someone
mentioning a bunch of tools that can help increase the security of your laptop
I decided to take the plunge.

First, I installed [Little Snitch](https://www.obdev.at/products/littlesnitch/index.html).
It monitors all my network connections and provides me with a bunch of options
to allow or deny the connection, forever or just for a limited time. Starting
with this tool I had to (and still are, to a minor extent) acknowledge and
decide what to do about a ridiculous number of connection attempts by all sorts
of programs. For the older crowd, I feel like I am playing some new version of
Everquest. So. Much. Furious. Clicking.

Not content to develop repetitive stress injuries to my right hand, I installed
[Little Flocker](https://www.littleflocker.com/). It's a good complement
to Little Snitch -- it watches for any interactions with files, looks for
keystroke loggers, and checks for malware. More. Clicking.

Next up was to install [Micro Snitch](https://obdev.at/products/microsnitch/index.html)
to tell me any time my webcamera and microphones were being used. More alerts
to acknowledge but at least my microphone only turns on when I need it to. So far.

Finally I installed [BlockBlock](https://objective-see.com/products/blockblock.html)
to let me know if something keeps trying to install malware in known locations.
Just another layer of security for someone to overcome. They clearly indicate
that the application is in beta, so keep that in mind.

With those apps installed and running and configured, I massaged my very sore
wrist and started reading [this awesome document](https://github.com/drduh/macOS-Security-and-Privacy-Guide) at the
suggestion of a kind soul on Twitter. Lots of great stuff in there that you
can do and raises interesting points about deciding what type of threats you
are looking to protect yourself from. Here's a list of the advice from it that
I followed:

* patch everything when updates are available
* frequent system backups (shoutout to [Backblaze](https://www.backblaze.com/))
* full-volume encryption
* third-party firewalls
* Disable Spotlight Suggestions
* Use [Homebrew](http://brew.sh/)
* turn off captive portal
* use [Privoxy](https://www.privoxy.org/) as a local web proxy

I plan on implementing some of the other recommendations, but that's what I
started with. For Mac users, please read through that document. So much good
stuff along with explanations of why you should do it.

Hope that helps!

*UPDATE February 1, 2018*

I received two emails recently pointing out a few things about the tools above.

The first was that the company that sponsors the work of Privoxy has a link on their web site to 
some very sketchy financial trading software. The person who informed me of
this was trying to get me to link to a free VPN solution they were promoting.
My personal view is that people running free VPN's are sniffing the hell out
of your traffic selling what you're are doing to someone. Make the decision to
use a free VPN service with your eyes wide open.

Secondly, I used to recommend the dnsmasq/DNSSEC/DNSCrypt combo but DNSCrypt is no longer available, so I
suggest you look for some other tools for encrypting your DNS traffic. The
person who emailed me about DNSCrypt pointed to a blog post they wrote about
about [DNSCrypt alternatives](https://thebestvpn.com/dnscrypt-best-alternatives/).
Either way, encrypting your DNS is a good idea so please consider it.

I used to recommend [Little Flocker](https://www.littleflocker.com/) but it looks
like the project has become an F-Secure product and is no longer free. Check out
it's successor [F-Secure XFENCE](https://campaigns.f-secure.com/xfence/)
