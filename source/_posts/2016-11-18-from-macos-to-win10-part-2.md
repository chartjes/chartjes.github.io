---
layout: post
title: "From macOS to Windows 10 - Part 2"
author: Chris Hartjes
date: 2016-11-18
comments: true
sharing: true
---
I spent this past week only using my loaner [Surface Book](https://www.microsoft.com/surface/en-us/devices/surface-book)
instead of my trusty MacBook Air for doing my work at the [day job](https://mozilla.com).
If there is a better of test for figuring out if I can do my regular work in it,
I can't think of one.

## It Has Linux Under The Hood

In the [previous post](https://www.littlehart.net/atthekeyboard/2016/11/10/from-macos-to-win10-part-1/)
I talked about how you could get a Bash shell using Ubuntu 14 (I think) running
natively on Windows. Well, it absolutely 100% works except for one problem
that I had. I was trying to debug a problem with an API  using [curl](https://curl.haxx.se/)
and it just wouldn't return anything at all. A quick pop back to macOS and
everything was just fine. Still no idea what the issue is, but I think I
need to try and reproduce it. I do know that the lead developer for curl
works at Mozilla so maybe I can get some help that way.

Otherwise, *everything* I normally do in the macOS terminal (well, [iTerm2](https://iterm2.com/))
I was able to do just fine in the Bash shell in Windows 10. I was pleasantly
surprised.

All the other tools I used for work were just fine:

* The [Atom](https://atom.io) editor behaved just fine
* Firefox is cross-platform, everything was just fine
* I didn't like how our video chat client looked (fonts way too small) but it worked

In other words, I could easily see myself using a Surface Book every day for
work. To be honest, if I didn't have access to the Bash shell I wouldn't even
have bothered trying to do this.

So what are the last few things I have to try out?

* need a HTTP client similar to [Paw](https://paw.cloud/)
* connected to external monitor and keyboard
* better hosts file management -- [Gas Mask](http://gas-mask.apponic.com/mac/) is just so good
* haven't fired up Skype in it yet
* haven't looked at screencasting software

Next week I should have another update on putting the last touches onto the
experience.
