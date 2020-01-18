---
layout: post
title: "Marionette -- First Steps"
author: Chris Hartjes
date: 2016-02-29
comments: true
sharing: true
---
(I'm not sure I've ever done a post on a Leap Day...)

At Mozilla a lot of folks make use of automation tools in order to write tests.
There's even an entire IRC channel devoted to discussions about it. As I get
depper and deeper into my time at Mozilla I now have to think about how to use
these tools to accomplish my testing goals. Like my post about [using Docker](https://littlehart.net/atthekeyboard/2016/02/03/containers-and-the-grumpy-tester/)
I wanted to share my first steps in using Marionette, a set of automation tools
that focus on driving a browser much in the same way [Behat](http://behat.org) does.
It's an essential tool for testing all the various versions of the FireFox broswers
that Mozilla releases.

In this case I'm going to be highlighting the use of [Marionette Driver](https://pypi.python.org/pypi/marionette_driver/1.1.0). This is a Python
library that allows you to control a browser that has [support for Marionette built in](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette/Builds).

As an aside, I find it very encouraging that the major browser companies are
starting to build hooks right in to support tools that use the [WebDriver API](https://github.com/w3c/webdriver).

As the link to Marionette-enabled builds states, support for interacting with
Marionette is in every recent (as of February 29, 2016) build of Firefox that is
available to the public but is not turned on by default. To enable it, you will
need to start Firefox from the command line and add a `--marionette` switch.

My examples were done on Mac OS-X El Capitan. Specific steps might be different
for your environment. So let me run your through a very quick example of how
Marionette does it's stuff.

First, I opened another terminal window and started up a copy of [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) and started it up:

`/Applications/FirefoxDeveloperEdition.app/Contents/MacOS/firefox --marionette`

Once it started, there was a notice that it was ready and listening for connections
on port 2828, which is the default. Next I proceeded to use [Virtualenv](https://github.com/pypa/virtualenv) to create a sandboxed environment
for my code to run in. Once inside this new virtual environment
I installed the Marionette driver using the version of [pip](https://pip.pypa.io/en/stable/)
that Virtualenv had thoughtfully installed:

`pip install marionette_driver`

With the Marionette driver installed, it was time to do a simple test to make
sure everything was working. I fired up a Python interpreter (2.7.1) and
tried to load a web page up the same way the [old documentation for Marionette client](http://marionette-client.readthedocs.org/en/latest/interactive.html)

Here's a very simple example of how to use it:

~~~
Python 2.7.11 (default, Jan 22 2016, 08:29:18)
[GCC 4.2.1 Compatible Apple LLVM 7.0.2 (clang-700.1.81)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import marionette_driver
>>> from marionette_driver import marionette
>>> client = marionette.Marionette(host='localhost', port=2828)
>>> client.start_session()
{u'rotatable': False, u'raisesAccessibilityExceptions': False, u'takesScreenshot': True, u'acceptSslCerts': False, u'appBuildId': u'20160225004014', u'XULappId': u'{ec8030f7-c20a-464f-9b0e-13a3a9e97384}', u'browserVersion': u'46.0a2', u'specificationLevel': u'1', u'platform': u'DARWIN', u'browserName': u'Firefox', u'version': u'46.0a2', u'device': u'desktop', u'proxy': {}, u'platformVersion': u'15.3.0', u'takesElementScreenshot': True, u'platformName': u'Darwin'}
>>> client.execute_script("alert('o hai there!');")
>>> client.navigate("http://www.mozilla.org")
>>> client.get_url()
u'https://www.mozilla.org/en-US/'
>>> from marionette_driver import By
>>> first_link = client.find_element(By.TAG_NAME, "a")
>>> first_link.click()
~~~

What did I do?

* loaded the Marionette-driver library
* from that library I wanted to use some functionality that's part of `marionette`
* create a `client` that's connected to a browser running on `localhost` and port 2828
* start a session
* cause the browser to execute some arbitrary Javascript (an alert in this case)
* navigate to a specific page
* verify the URL
* grab a helper for identifying elements in a page
* find the first `a` tag on the page
* click that link

I am just at the beginning of my work using Marionnette (how the heck can I click
on things that are part of the brower itself and not on the HTML page). Hope
this little example helps you get started too.
