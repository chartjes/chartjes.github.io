---
layout: post
title: "Mocking a function with different return values in Python"
author: Chris Hartjes
date: 2019-05-15
---

For the first half of 2019 I was borrowed by the Performance Team
at Mozilla and asked to help them implement a way to measure the
performance of various browsers on Android platforms. This has
involved me getting familiar with several tools and environments
that I had not touched before:

* Mozilla's tooling for use with [mozilla-central](https://hg.mozilla.org/mozilla-central)
* Rooting Android devices for testing purposes
* [Android Studio](https://developer.android.com/studio/) and it's device emulation tools
* Executing and parsing shell commands

Of course, I am using [pytest](https://docs.pytest.org/en/latest/) as well to make sure
that I had thought about testing scenarios and giving whomever
supports this code once I am back at my previous role a chance
to figure out what is going on.

One of the testing scenarios I came up with was handing the fact that I
had designed the code to have a fallback mode in case the
shell command I was using did not work on that particular
device. Some code reviews from other developers revealed
some differences in how the [`top` command](https://www.unixtutorial.org/commands/top)
works on different phones.

So, drawing  on my own experiences with using test
doubles in PHP, I asked myself "how can I create
a mock that has different return values?". In
pytest this functionality is called `side_effect`.

So, here is some of the code in question that I needed
to test:

```python
try:
    cpuinfo = raptor.device.shell_output("top -O %CPU -n 1").split("\n")
    raptor.device._verbose = verbose
    for line in cpuinfo:
   	data = line.split()
            if data[-1] == app_name:
                cpu_usage = data[3]
except Exception:
    cpuinfo = raptor.device.shell_output("dumpsys cpuinfo | grep %s" % app_name).split("\n")
    for line in cpuinfo:
        data = line.split()
        cpu_usage = data[0].strip('%')
```

I wrapped the first call in a try-catch construct because
an exception is thrown if anything is up with that `top`
call. If that call doesn't work, I then want to use that
`dumpsys` call.

In the test itself, I would need the `shell_output` call
to first throw an exception (as expected for the scenario)
and then return some output that I can then parse and use.

In the PHP world, most test doubling tools allow you to
create a mock and have it return different values on
consecutive calls. Pytest is no different, but it took
me a while to figure out the correct search terms to find
the functionality I wanted.

So, here is how I did it:

```python
def test_usage_with_fallback():
    with mock.patch('mozdevice.adb.ADBDevice') as device:
        with mock.patch('raptor.raptor.RaptorControlServer') as control_server:
            '''
            First we have to return an error for 'top'
            Then we return what we would get for 'dumpsys'
            '''
            device.shell_output.side_effect = [
                OSError('top failed, move on'),
                ' 34% 14781/org.mozilla.geckoview_example: 26% user + 7.5% kernel'
            ]
            device._verbose = True

            # Create a control server
            control_server.cpu_test = True
            control_server.test_name = 'cpuunittest'
            control_server.device = device
            control_server.app_name = 'org.mozilla.geckoview_example'
            raptor = Raptor('geckoview', 'org.mozilla.geckoview_example', cpu_test=True)
            raptor.device = device
            raptor.config['cpu_test'] = True
            raptor.control_server = control_server

            # Verify the response contains our expected CPU % of 34
            cpuinfo_data = {
                u'type': u'cpu',
                u'test': u'usage_with_fallback',
                u'unit': u'%',
                u'values': {
                    u'browser_cpu_usage': '34'
                }
            }
            cpu.generate_android_cpu_profile(
                raptor,
                "usage_with_fallback")
            control_server.submit_supporting_data.assert_called_once_with(cpuinfo_data)
```

Let me break down what I did (as always, I am open to
suggestions on better ways to write this test).

The first double is for a class that communicates with the
Android device. Then the next double I needed was for the
"control server", which is what is used to control the
browser and execute tests. 

My first "side effect" is to generate an error so it
triggers the first condition of the scenario that
'top should not work'. The second "side effect" is
the response I am expecting to get from the shell
command in my fallback area of the code.

Then I continue with the "arrange" part of the [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert)
testing pattern I like to use -- I configure my
"control server" to be the way I want it.

I finish up with creating what I expect the data
that is to be submitted to our internal systems
looks like.

I execute the code I am testing (the "act" part)
and then use a [spy](https://github.com/testdouble/contributing-tests/wiki/spy)
to make sure the control server would have submitted
the data I was expecting to have been generated.

The ability to have a method return different values
is powerful in the context of writing tests for code
that has conditional behaviour. I hope you find this
example useful!
