---
layout: post
title: "Docker as a testing tool"
author: Chris Hartjes
date: 2019-01-31
comments: true
sharing: true
---

Yes, [Docker](https://docker.com) can be used as a tool to help
you out with some testing problems. Let me show an example of
how it makes some load testing easier.

One of the projects I support at [Mozilla](https://mozilla.com) is
the push notification service that we run. Among the tests that
I do for them is a load test using an [internal tool](https://github.com/mozilla-services/autopush-loadtester) 
that the developers of the service created. It is a [Twisted](https://twistedmatrix.com/trac/) application that runs using [PyPy](https://pypy.org).

No, I do not know why they made those choices. Further more, it
doesn't matter because I have to use it so I roll with the weirdness.

Installing it locally on my MacBook Pro was straightforward --
the docs even cover expected weirdness with some support libraries.
But now that I have switched over to using Windows at work I
ran into some difficulties getting all the dependencies installed
in [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about).

In fact, one of the developers uses Windows...and told me of
the experience he had at failing to get it to work. "I just use
VMWare Player and an Ubuntu VM".

I tried to get that working...and ran into a bunch of issues
where I had to disable something called "Windows Defender Credential Guard". Which bugged me because I like to keep security mechanisms in place
normally. I followed instructions FROM MICROSOFT on how to do it
and VMWare Player still wouldn't run. Kept giving me the same
error.

Okay, on to plan B -- Docker.

The first question was "how do I make this work?". I theorized
I needed to do something like this:

* find a base container of Ubuntu 18
* get inside a running version of that image
* install all the required dependencies
* verify that the load testing tool works
* make a copy of that container
* push that copy up to Docker hub for teammates to use


Some searching revealed that I could get a running Ubuntu
container and connect with it:

```
docker run --rm --it ubuntu
```

This downloaded the image and gave me access to it via
a [Bash](https://www.gnu.org/software/bash/) shell.

With that shell, I started installing all the packages
I would need to install the load testing tool, including
adding the package repository for PyPy so I could install
it with the package manager.

Once I got all the dependencies installed, I made sure that
the tests could run. I even found out that there was a bug
in the documenation. ;)

With a Docker image that had a working installation of the
load testing tool, the next step turned out to be more
straight forward than I had thought.

The Docker feature I needed was called snapshots. Here is
what I did.

With the Docker container still running, I opened up
another shell (in this case I am using [Powershell](https://docs.microsoft.com/en-us/powershell/)) and used the command `docker ps`
to get the name that had been assigned by Docker to my
running container.

With that name I used the following command to save
a version of that container:

```
docker commit name_of_container ubuntu:ap-loadtester 
```

Then I tagged the container so I can push up to Docker
hub under my account:

```
docker tag ubuntu:ap-loadtester chartjes/ap-loadtester
```

Last, I pushed it up to Doker hub

```
docker push chartjes/ap-loadtester
```

So now I have:

* an Ubuntu container I can share
* that has all the dependencies installed
* can be used by teammates to load test the push service

Again, I emphasize that a tester with some programming
experience can create some really useful testing tools
by leveraging the same tools and environments used to
build whatever you are testing.
