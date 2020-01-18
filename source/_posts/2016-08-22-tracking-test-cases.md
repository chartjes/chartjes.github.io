---
layout: post
title: "Tracking Test Cases"
author: Chris Hartjes
date: 2016-08-22
comments: true
sharing: true
---

Having done unit tests for so long, there is a tendency to forget that when you
start doing QA work you need to make sure your test cases are recorded somewhere
so they can be found by others later. The test code you write is always there
in the unit test! Hopefully it makes sense to others.

Since I do a QA role, I'm not touching anyone else's unit tests. I end up using
a combination of automation (always in Python and mostly with [pytest](http://docs.pytest.org/en/latest)) and manual testing. Things like API
contract tests (did they add new fields to their API without telling me?!?) or
scripts written by developers to verify things like "are the cryptographic
signatures for this data still correct".

At Mozilla we use [Bugzilla](https://www.bugzilla.org/) to track pretty much
everything that we do. Pretty much all of my testing happens when one of the
projects I do QA work for is ready to do a new release. A "bug" is created, I
am assigned to it as the QA contact and away we go with the process to get code
approved by QA for deployment to production.

For example, here's me running some scripts and reporting the results along
with a question:

![QA feedback](https://grumpy-learning.s3.amazonaws.com/e6gv86j8.png)

(Turns out I can only run that xml-verifier script in our staging environment)

We use [virtualenv](https://pypi.python.org/pypi/virtualenv) a lot to create small sandboxed environments to run our tests in, and the developers on the [Kinto Project](https://github.com/Kinto) have been very good at creating small little
tools for me to use to help with testing things.

So not only did I have to test that all the signatures remain the same, I also
needed to do some manual testing to ensure the admin UI they created works
as expected.

We are starting to use [TestRail](http://www.gurock.com/testrail/) to track
our software test cases. One of the goals is to use it's API and make calls to
it as part of test runs -- we're in the early stages, but that is something
I am working on this upcoming week.

Here's an example of me outlining the manual process of adding some fonts to
the collection that [Fennec](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Build_Instructions/Simple_Firefox_for_Android_build) uses.

![Test cases for Kinto Writer](https://grumpy-learning.s3.amazonaws.com/L8psH5O2.png)

Later in the same "bug" about deploying Kinto, I added my notes on doing the
manual testing for uploading fonts.

![Manual testing passed](https://grumpy-learning.s3.amazonaws.com/PUzu7ofc.png)

Python + Pytest + Virtualenv + Bugzilla + TestRails == my tools for testing.
