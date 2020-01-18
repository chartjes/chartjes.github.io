---
layout: post
title: "Using markers in pytest"
author: Chris Hartjes
date: 2018-01-15
comments: true
sharing: true
---

At the [current day-job](https://mozilla.com) I use [pytest](https://docs.pytest.org/en/latest)
for writing what I call "configuration tests" for the various services
and tools that I am responsible for doing QA work for.

One of these is [Kinto](https://github.com/Kinto/), a "generic JSON
document store" that we wrote (and open-sourced) at Mozilla and is
used by a lot of services.

These days there are three "flavours" of Kinto that I have to worry about:

* `kinto-dist` which is the core of Kinto
* `kinto-settings` which is the Kinto core plus a bunch of records representing settings stored for users of Firefox
* `kintowe` which is the Kinto core and some extensions for it that we use to track records of what web extensions Firefox users have stored

Whenever we have a new version of any of these "flavours" that need
to be tested, it is deployed to a target environment (either staging
or production) and tests that I wrote are run by our operations team's
deployment tool making a call to a CI server run by the QA department.
This CI server then runs all the tests I wrote.

But I had a problem. There were some tests that needed to be run no
matter what "flavour" we were deploying, and then some tests that
belong only to one "flavour". Previously I just had duplicate repos
but wanted to consolidate them.

I enlisted the help of one of our team tool-makers [Dave Hunt](https://twitter.com/davehunt82)
while at our All-Hands meeting in Austin in December of 2017 to go
over some better strategies and to make better use of our CI server.

After scribbling a lot of stuff on a white board to get Dave up to
speed, he suggested moving all the tests into one repo and using a 
feature of pytest called "markers" to figure out what "flavour" we
were testing.

Note: at the time of writing I was doing this work with Python 3.6.3
and pytest 3.3.2.

Pytest makes heavy use of decorators to extend its functionality.
Fixtures (which can be best described as helper methods for tests)
are declared using annotations, and then these fixtures are
available to any test method that you pass it into as a parameter
(with some exceptions based on the scope of a fixture).

Here's an example of a fixture that reads in a configuration file
and returns an object that contains those values:

```python
@pytest.fixture(scope="module")
def conf():
    config = configparser.ConfigParser()
    config.read('manifest.ini')
    return config
```

To use it, I just pass it in as a parameter like this:

```python
async def test_server_info(api, conf, env):
    res = await api.server_info()
    data = await res.json()
    expected_fields = aslist(conf.get(env, 'server_info_fields'))

    for key in data:
        assert key in expected_fields

    for field in expected_fields:
        assert field in data
```

To use a marker, I simply add an annotation to tell pytest "mark
this test as belonging to `dist`" or any other "flavour" I want
this test to belong to. Check out the annotations for this test:

```python
@pytest.mark.asyncio
@pytest.mark.dist
@pytest.mark.settings
@pytest.mark.webextensions
async def test_version(api, conf, env, apiversion):
    res = await api.__version__()
    data = await res.json()
    expected_fields = aslist(conf.get(env, 'version_fields'))

    # First, make sure that data only contains fields we expect
    for key in data:
        assert key in expected_fields

    # Then make the we only have the expected fields in the data
    for field in expected_fields:
        assert field in data

    # If we're passed an API version via the CLI, verify it matches
    if apiversion:
        assert apiversion == data['version']
```

There is a lot going on here, let me break it down:

* we are marking this test as being able to run asynchronously using Python 3's [asyncio](https://docs.python.org/3/library/asyncio.html) module
* we want this test to be run any time we are testing `dist`
* we want this test to be run any time we are testing `settings`
* we want this test to be run any time we are testing `webextensions`
* we are passing in an API helper as a parameter
* we are passing in a configuration helper as a parameter
* we are passing in a helper that reads a target environment parameter from the CLI
* we are passing in a halper that reads an API version parameter from the CLI

Here's a test we only want run when we do a `kinto-settings` deployment:

```python
@pytest.mark.settings
def test_plugins_signatures(env, conf):
    client = Client(
        server_url=conf.get(env, 'reader_server'),
        bucket='blocklists',
        collection='plugins'
    )
    try:
        collection, records, timestamp = get_collection_data(client)
        if len(records) == 0:
            pytest.skip('blocklists/plugins has no records')

        assert verify_signatures(collection, records, timestamp)
        assert verify_signer_id(collection, 'onecrl_key')
    except KintoException as e:
        if e.response.status_code == 401:
            pytest.fail('blocklists/plugins does not exist')
        pytest.fail('Something went wrong: %s %s' % (e.response.status_code, e.response))
```

I also needed a way to figure out what markers were set so I could
use the correct value from our configuration file (depending on the
environemnt). Pytest has a `request` fixture that is globally available
to any test.

I have another helper that uses [Swagger](https://swagger.io/) to
parse an API spec that the developers built for me. I pass the
`request` object to the API helper, and look for specific markers:

```python
@pytest.fixture(scope="module")
def api(event_loop, conf, env, request):
    api_definition = 'dist_api_definition'

    if 'settings' in request.node.keywords:
        api_definition = 'settings_api_definition'
    elif 'webextensions' in request.node.keywords:
        api_definition = 'webextensions_api_definitions'

    return API(conf.get(env, api_definition), loop=event_loop)
```

(By the way, you can find all this code in the [GitHub repo](https://github.com/Kinto/kinto-integration-tests)
for these tests)

So, when we are doing a deployment of `kinto-dist` to our staging
environment, we can run the tests this way:

```shell
pytest -m dist --env=stage config-tests/
```

Then the tests we want to get run, get run. I'm not sure what
other ways there are to organize your tests, but this is a method
that works and makes sense to me. Got any comments or suggestions?
Email me or contact me via Twitter using details in the sidebar.
