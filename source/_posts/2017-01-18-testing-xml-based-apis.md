---
layout: post
title: "Testing XML-based API's"
author: Chris Hartjes
date: 2017-01-18
comments: true
sharing: true
---
At the [day job](https://mozilla.org) I deal with making sure that a number
of different services
get tested sufficiently that we have confidence that what's being deployed and
then used by Firefox is correct. This is a big change from what I did before
I got to Mozilla - I mostly wrote unit tests and integration tests for code.
These services are like black boxes as far as QA is concerned -- I do have
some insight into the code itself by being involved in code reviews to make
sure unit and integration tests are still in place but my task is to make sure
the service is functioning as expected.

Since it's 2017, most of the services around here are returning JSON-based
responses but [Balrog](https://github.com/mozilla/balrog) returns XML that
is consumed by Firefox itself to let you know any updates that need to be
made to Firefox itself or any add-ons you've installed.

Normally I would write some [pytest](https://pytest.org) scripts that use the
[Requests](https://pypi.python.org/pypi/requests) library and then parse the
XML responses. These days I like to create what I call "API contract" tests
that look at the API responses and verify not that the contents of the
response make sense, but we look at the "shape" of the responses to make sure
we are getting expected fields and other content. This helps us catch any
unexpected changes to the body of the response and also verify the documented
calls to API's are still correct.

So I was all set to dive into parsing XML in Python (shoutout to [lxml](http://lxml.de/))
when my co-worker [Tarek](https://ziade.org/) suggested an easier path is to
use DTD (Document Type Definition) files instead. "It would be easier than
what you are trying to do and probably faster." Tarek is very wise.

So the process for the test would become something like this:

* make a request to a known Balrog API endpoint
* grab the XML response
* validate it against the DTD
* assert that the validation worked
* profit!

I know I mentioned I am using Python for this but the same principles apply to
any language where there are tools available to manipulate and validate XML
using a DTD.

So, after conversing with the main developer on the project I got a list of
sample URL's and got some details about what fields where required, what ones
were optional, and some potential different responses. Next I needed to
create some DTD's that act as our validation set. For example, here's a
typical response from Balrog:

``` xml
<updates>
    <update type="minor" displayVersion="50.1.0" appVersion="50.1.0" platformVersion="50.1.0" buildID="20161208153507" detailsURL="https://www.mozilla.org/en-US/firefox/50.1.0/releasenotes/">
        <patch type="complete" URL="http://download.mozilla.org/?product=firefox-50.1.0-complete&os=win64&lang=en-US&force=1" hashFunction="sha512" hashValue="1c2cea9770c814c58058c66ad9f99c678bf1612c8e05960fe415772383c4ab5e293eafef51b8b574307667a880c567d71b0d32c89d2c65dae02f68967991f8f7" size="56892755"/>
        <patch type="partial" URL="http://download.mozilla.org/?product=firefox-50.1.0-partial-50.0.1&os=win64&lang=en-US&force=1" hashFunction="sha512" hashValue="52dab15fb6cbfb3a324a117fb5f1576a0b5947555d1a4535e0f5735a918e817d7c03f5300b3624883758b3a9300a9061a0e190087f1653fef39eb77b81311f69" size="13185929"/>
    </update>
</updates>
```

(Apologies for the long line lengths)


FYI I used [this documentation](http://www.w3schools.com/xml/xml_dtd.asp) to
figure out what I needed to do to make the DTD work.

Now, what does the DTD look like?

```
<!ELEMENT updates (update*) >
<!ELEMENT update (patch+) >
<!ATTLIST update
type CDATA #REQUIRED
displayVersion CDATA #REQUIRED
appVersion CDATA #REQUIRED
platformVersion CDATA #REQUIRED
buildID CDATA #REQUIRED
detailsURL CDATA #IMPLIED
licenseURL CDATA #IMPLIED
showPrompt CDATA #IMPLIED
showNeverForVersion CDATA #IMPLIED
actions CDATA #IMPLIED
openURL CDATA #IMPLIED
notificationUrl CDATA #IMPLIED
alertUrl CDATA #IMPLIED
promptWaitTime CDATA #IMPLIED
backgroundInterval CDATA #IMPLIED >
<!ELEMENT patch (#PCDATA)>
<!ATTLIST patch
type CDATA #REQUIRED
URL CDATA #REQUIRED
hashFunction CDATA #REQUIRED
hashValue CDATA #REQUIRED
size CDATA #REQUIRED >
```

There is a lot going on in here so let's break it down. This DTD describes
the elements and attributes I am expecting to find in this type of response
from the service.

* There needs to be a top element *updates*
* It has zero or more *update* elements (the \* indicates that)
* Each *update* has a bunch of attributes that are required or optional (that's what #IMPLIED refers to)
* Each *update* should have one or more *patch* elements
* Each *patch* element has some required attributes

The Python code for a test is pretty simple. Again, substitute your own
preferred tools in your own language of choice.

``` python
'''
We're using lxml for the XML parsing and validating
url contains the full URL to the API endpoint
'''
repsonse = requests.get(url)
root = etree.XML(response.text)
# Load our DTD file
f = open('./api-tests/updates.dtd')
dtd = etree.DTD(f)

# Validate the response against the DTD and show the errors if it fails
valid = dtd.validate(root)

if valid:
    assert True
else:
    print(dtd.error_log.filter_from_errors())
    assert False
```

As a rule I try and find libraries and tools that solve problems for me rather
than write my own. In this case, lxml and the use of DTD's was the right
choice than my initial thoughts of using [XPath](https://en.wikipedia.org/wiki/XPath)
to hunt for attributes inside the elements.

Hope this gives you a different perspective on strategies for testing API's.
