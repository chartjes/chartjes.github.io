---
layout: post
title: "Learn To Test Like A Grumpy Programmer - Part 2"
author: Chris Hartjes
date: 2019-01-16
comments: true
sharing: true
---

(If you use PHP, you can learn how to write automated tests for your code via my ["Learn To Test Like A Grumpy Programmer" course](https://leanpub.com/c/learntotest) over at LeanPub)

In this blog post I wanted to talk about some of the lessons I've
learned at the [day job](https://mozilla.com) about how to use tools and techniques
we are familiar with in the developer world to make our job of
testing things easier.

## Mozilla's Push Notification Service

One of the projects I do QA work for is the [push notification service](https://support.mozilla.org/en-US/kb/push-notifications-firefox)
that Mozilla runs. Yes, I know a lot of people get supremely annoyed
by push notifications. Yes, they are heavily abused by people. Mozilla
tries to use them in a way not designed to annoy you. But this is the
Internet after all, where everything annoys somebody somehow.

My work for that team involves doing testing of the service whenever
a new version is ready to be released. The process goes like this:

* the development team tags a new release along with a [changelog](https://en.wikipedia.org/wiki/Changelog)
* the operations team deploys this new release to the staging environment
* I create a [BugZilla](https://bugzilla.mozilla.org/) ticket to track the deployment and testing results
* I run a series of tests against the service on staging, recording my progress there

If all my tests pass on staging, I give approval to deploy that version
of the service to production. The process for that is:

* the operations team deploys the new release to production
* I create another ticket to track the deployment process and testing results
* I run the same tests and add an additional set of load tests to make sure the service is responsive

So what tests do I run?

## API Contract Tests

I wrote some tests using [pytest](https://pytest.org) that make API
calls using known values and verify that we are getting the responses
that we expect.

These tests usually are not difficult to write and I did experiment
with making them asynchronous using [pytest-asyncio](https://github.com/pytest-dev/pytest-asyncio)
so I could learn how asynchronous code works in Python. If you had
a very large test suite, I could see it being useful to speed up the
process. This particular test suite is not big enough to warrant that.

For my fellow PHP folks, there are some plugins for [PHPUnit](https://phpunit.de)
that can run your tests in parallel. For one example check out [PHPChunkit](https://github.com/jwage/phpchunkit)

## Load Tests

I only run the load tests on the production version of the service because
the number of nodes that handle push notification requests is higher in
production. These tests are designed to put some non-trivial load onto
the system and examine the output from the nodes for any error messages.

## VAPID Testing

I use two different Android devices for these tests. Each device has
latest stable and nightly releases of Firefox on them. One device
is configured to point at staging, the other at production.

A web page is loaded that uses Javascript to generate [VAPID-based notifications](https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/).

In the summer of 2018 I did experiment with seeing if I could automate
these tests so I could use an online service offering cloud-accessible
Android images. I did make some progress but it seems like some of the
pieces needed to do things like make sure I don't have to click on the
browser to accept notifications are either really brittle or don't exist,
depending on what automation tools you are using.

## Desktop Notification Tests

The person who did this testing work before me created a Nodejs app that
serves up an web page with some forms and buttons on them. You fill in
some values and it creates a series of push notifications that you
visually verify work. He then put it inside a Docker container to make
it easier for others to run those tests.

This test used to be on a personal web page of a (now-former) Mozilla
employee. 

## Desktop WebPush Tests

These tests are to make sure that a feature of the service where you
can group WebPush messages together by topic, only displaying the last one,
works correctly.

The process for these tests are:

* checkout a [GitHub repo](https://github.com/jrconlin/topics) that contains the test
* configure everything according to the documenation
* start up the "topic server" via the CLI, which is serving up a one-page [Cyclone](https://cyclone.io) web application
* click on a button fire up a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) that receives requests to send a WebPush notification
* then use another CLI tool to fire off notifications (with or without a topic)
* visually verify that the notifications appeared

Given that I already had a Docker-based solution, I decided it was time
to turn this test into something where I only have to click a few buttons
instead of running things via the CLI.

The first step was to update the existing one page app to have two more
buttons. So I edited the HTML to add some buttons and then added some
JavaScript that made calls to two new URL's for the app.

I then added those two URL's to the Cyclone app, porting over code from
the CLI "topic pusher" tool to generate the notifications.

There was already a Dockerfile for the application, so I used that and
then spent some time building and rebuilding and debugging the application
to make sure it did actually make it so all I had to do was the following:

* download the Docker image
* start running the image (making sure to tell Docker to forward the correct port)
* click on the Subscribe button and see the message that the service worker is running and the browser asks to accept notifications
* click on the button that sends a single notification and visually verify output
* click on the button that sends multiple notifications grouped by topic and visually verify output

So now I have a test that I can point other folks to that they can
use without having to install any dependencies in their local environment
other than a web browser and Docker.

## Programming Skills + QA work == Solving Interesting Problems

I am far from the only person who has this skill set. But having
some ability to create your own purpose-specific tools means
that the people around you get to benefit.

Often the tools (and automation solutions) that folks use to
test things are proprietary and not open to be modified. So
you expend a lot of energy trying to bend a tool towards a
new purpose.

There are other folks out there like me who busy creating wrappers
around hard-to-use tools or creating new solutions with the
goal of making what used to be difficult a lot easier. Encourage
those people and promote what they are doing!
