---
layout: post
title: "Mutation Testing"
author: Chris Hartjes
date: 2016-01-16
comments: true
sharing: true
---
(This is a re-post from my [newsletter](http://grumpy-learning.com/newsletter).
Sign up to get this material when it first comes out)

Hello fellow testers! It's a new year and my 19th as a software developer, which
is crazy when I actually sit down and think about it. I hope you had an
enjoyable holiday break and going back yesterday didn't stress you out too much.

This week I wanted to talk about an interesting testing tool that was created
by the driving force behind Mockery, Pádraic Brady. It's called [Humbug](https://github.com/padraic/humbug) and it
is a mutation testing tool. 

Mutation testing is a process by which you alter the actual source code by
injecting small changes, then re-running the unit tests. The idea behind it is
that if unit tests are designed to make sure
you haven't introduced any regressions into your code, "mutating" tiny bits of
it should be caught by your tests.

Based on Pádraic's comments, it seems he feels that mutation testing is more
valuable than aiming for high code coverage. He states that it's "intended to
help you judge how well your unit tests actually perform and where they could
be improved"

He wrote up a [nice long article about it](http://blog.astrumfutura.com/2015/01/lies-damned-lies-and-code-coverage-towards-mutation-testing/)
and it's a very interesting perspective to take. The interesting thing I took
from it is what is the real value behind mutation testing.

If you deliberately change something in your code and the unit test fails,
that unit test was actually good! If it passes then it means you probably have
a defect in your code that you didn't think about. Time to take a look
at that mutation and figure out what needs to be changed.

There are so many good points in his article that I suggest you read it for
yourself and decide if you think it's a useful tool. I think it is definitely
worth running it a few times on your code base, if only to watch it in action.

I'm afraid it will show some horribleness in the [OpenCFP](https://github.com/opencfp/opencfp) code base...
