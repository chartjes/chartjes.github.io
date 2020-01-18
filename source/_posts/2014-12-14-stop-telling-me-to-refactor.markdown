---
layout: post
title: "Stop Telling Me To Refactor"
author: Chris Hartjes
date: 2014-12-14
comments: true
sharing: true
---
I got an email from Daniele earlier this morning about the post I did talking
about [how web acceptance tools suck](https://littlehart.net/atthekeyboard/2014/10/31/web-acceptance-tools-suck/) and
they were kind enough to share their thoughts on how they felt I was (to use
their words) "facing the problem in the wrong way".

They went on to describe how I should just separate the front-end from the
back-end to make testing the app as a whole easier. They shared a link
to a project where they had done that so [go take a look](https://github.com/fourlastor/playlist).

I don't find much wrong with that approach but it has a hole in it big enough
to throw my ego through without scraping the sides. Daniele, this has nothing
to do with you and everything to do with a mind set that continually comes up
in our industry.

The incredible casualness with which we tell people that the solution to all
their problems is to refactor things.

Just stop it. Stop telling me that. Stop telling other people that. It reflects
that you have given no thought to the other person's situation. Do they have
the time to refactor? Do they have permission to refactor? Are they even skilled
enough to refactor the app in such a way to make it better? These are all legitimate
questions. Blindly recommending refactoring isn't the solution.

In my case for my current work-related activities, there is zero chance we will be
doing the kind of refactoring that Daniele is very-helpfully recommending. Why?
The application in question works and brings in money. So the app in it's current
form needs to stay up and keep working. So that means I need to find the least-invasive
way possible to test the application's UI.

There are other refactorings I am doing (moving the app from ZF1 to ZF2 is among
them) but those take time and have to ensure the existing application doesn't
crash and burn due to those changes. I suspect I may be ending up buying a bunch
of over-worked QA people in Kiev a nice thank-you present when they finish the
extensive testing I need them to do.

Send me your thoughts and ideas on Twitter or to chartjes@grumpy-learning.com
