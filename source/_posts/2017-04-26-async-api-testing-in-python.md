---
layout: post
title: "Async API testing in Python"
author: Chris Hartjes
date: 2017-04-26
comments: true
sharing: true
---
I've started liking the idea of creating contract-style tests for the APIs
that power services at Mozilla. They are simply another line of defense
against regressions and the accidental release of new functionality. As
with all my work at Mozilla, it's being done in Python using [pytest](https://docs.pytest.org/en/latest)
but thanks to some work from my co-worker [Tarek](https://twitter.com/tarek_ziade)
I have some new tools at my disposal.

First, we've started making use of [Swagger](http://swagger.io) to get 
the developers to document their APIs. There is a wide variety of tools
that work with Swagger API specs, but Tarek went a little further and
put together [Smwogger](https://github.com/tarekziade/smwogger) to make
this type of testing even easier.

He describes it as "a smoke test tool for services described through Swagger"
while I describe it as "a way for me to quickly write contract tests against an
API spec". I'm pretty sure we're both right.

While you can use it as a CLI tool (the docs are geared towards that) he also
thoughtfully added support for me to use the library from inside pytest. The only
catch is that the tool uses [asyncio](https://docs.python.org/3/library/asyncio.html),
which is what Python 3 uses to support writing concurrent code.

I thought it would be way more difficult than it was but Tarek guided me through
the extreme basics of concurrent Python code and after that I was able to write
the tests I wanted. So here's some code for you to see:

``` python
import asyncio
import configparser
import pytest
from smwogger import API

from fxtesteng.helpers import aslist

@pytest.fixture(scope="module")
def conf():
    config = configparser.ConfigParser()
    config.read('manifest.ini')
    return config


@pytest.fixture(scope="module")
def event_loop():
    return asyncio.get_event_loop()


@pytest.fixture(scope="module")
def api(event_loop, conf, env):
    return API(conf.get(env, 'api_definition'), loop=event_loop)


@pytest.mark.asyncio
async def test_version(api):
    res = await api.__version__()
    data = await res.json()
    expected_fields = aslist(conf.get(env, 'version_fields'))

    # First, make sure that data only contains fields we expect
    for key in data:
        assert key in expected_fields

    # Then make the we only have the expected fields in the data
    for field in expected_fields:
        assert field in data


@pytest.mark.asyncio
async def test_heartbeat(api):
    res = await api.__heartbeat__()
    data = await res.json()
    expected_fields = aslist(conf.get(env, 'heartbeat_fields'))

    # First, make sure that data only contains fields we expect
    for key in data:
        assert key in expected_fields

    # Then make the we only have the expected fields in the data
    for field in expected_fields:
        assert field in data
```

I hope the code is clear (except for the async parts) but the idea is 
to use the API object from smwogger to make calls, using the ID's that
the developer has assigned to that API call. I then loop through the
expected fields for that call (they are stored in that manifest.ini file
mentioned in the `conf()` fixture) and make sure everything matches
our expectations.

The next bit of work I need to do is to use the Swagger spec some more
and check the fields the API returns against what is actually in the spec
instead of using pre-defined values in that manifest file. Making sure
the developers follow their own specs is part of regression testing too!

