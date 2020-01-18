---
layout: post
title: "Containers And The Grumpy Tester"
author: Chris Hartjes
date: 2016-02-03
comments: true
sharing: true
---
Even with my personal focus on promoting Test-Driven Development I still end up
doing a lot of functional testing. For clarification purposes I want to define
a functional test as one where I create an automated test that treats the system
I'm testing as a black box.

In this case I needed to write some functional tests for [Kinto](https://github.com/Kinto/kinto).
Kinto is a lightweight storage server that is designed to be distributed-friendly
and is being used at Mozilla in production RIGHT NOW to handle the SSL certificate
revocation list that Firefox uses.

Being a big fan of automation, I started to brainstorm ideas on what the ideal
environment for running these tests would look like. So I set on the following
ideas:

* we should be able to easily start up however many instances of Kinto we need
* the test script itself needs to know if it's own dependencies are all set
* someone other than me needs to be able to easily use this tool

## Docker as a new QA tool

Before we go any further, please go and buy Chris Tankersley's [awesome book about Docker](https://leanpub.com/dockerfordevs). Chris is a friend of mine (and current
PHP Magic: The Gathering champion) and his help in going from knowing nothing
about Docker to knowing enough to create something useful was invaluable.

For the uninitiated, I will give a gross over-simplification of what Docker is.
Docker is a set of tools that allow you to create small containers inside which
you can run applications. The theory behind this is that is allows you to run
multiple applications on the same server. I'm not sure how it works it's magic
on Linux-based systems but on OS-X the tools have you using a Vagrant VM to
host all these containers for you. I'm not always comfortable with using tools
that appear to be magical to me, but I'm okay with what Docker is doing.

In many ways this reminds me of a tool that FreeBSD provided called [jails](https://www.freebsd.org/doc/handbook/jails.html). Back in 2003-2004 the
company I was working for gave us development boxes that worked on that used
jails to simulate what our production environment looked like. I thought it was
a very interesting bit of technology that solved a real problem -- how to
provide developers with a solid development environment.

Lucky for me the Kinto project already has a [Docker image we can use](https://hub.docker.com/r/kinto/kinto-server/)
so it seems like a natural thing to try and use. After some conversations with
[Mr. Tankersley](https://twitter.com/dragonmantank) it appeared what I needed
was to use [Docker Compose](https://docs.docker.com/compose/). Docker Compose
lets you start multiple containers at once, create links with them, and do
all sorts of other interesting things with them.

Initially I had a grand plan for using Docker Compose. I was going to spin up
containers for two different Kinto instances and then two [PostgeSQL](http://postgresql.org)
servers and then they can talk to each other and then it's going to be awesome
and I will look like a goddamn genius!

Like so many of plans, things started off super complicated and then eventually
got pared down to what I really needed. I ran into all sorts of problems with
my initial scheme because I ended up with basically what amounted to a race
condition happening.

I need to spin up the database containers FIRST and then run some database
migrations and OH MY GOD WHY IS THIS ALL SO COMPLICATED.

After banging my head unsuccessfully against this problem, I took a step back
and figured out what it was I really needed to create this environment. After
calming down and telling imposter syndrome to hit the road, I took a closer look
at what the Kinto containers were doing and realized it was fine to use the
default of creating a small in-memory database for storing things.

This is a test that is designed to be run in a continuous integration
environment so it doesn't really need any permanence. So with that issue out
of the way, I tweaked my Docker Compose configuration file until I was happy
with it:

~~~
master:
  image: kinto/kinto-server
  ports:
   - "8888:8888"
read-only:
  image: chartjes/kinto-read-only
  ports:
   - "8889:8889"
~~~

I created a [custom Docker image](https://hub.docker.com/r/chartjes/kinto-read-only/)
for this. I suppose it has a terrible name because it's not *really* a read-only
instance but it's playing the role of the "only read by Firefox" side of the
testing environment.

Do when you run `docker-compose` in the directory with this docker-compose.yml
file, it will spin up two containers that are running two different Kinto
servers.

## Semi-intelligent testing scripts

Next up was to write some tests. Right now we do our tests in Python using the
awesome [pytest](https://github.com/pytest-dev/pytest) testing tool. I wanted
to make sure that the test would gracefully fail if our Docker containers
weren't up and running so I hacked together some code that goes in the
`setup` method for the test.

~~~
def setUp(self):
    # Figure out what the IP address where the containers are running
    f = os.popen('which docker-machine')
    docker_machine = str(f.read()).strip()

    if string.find(docker_machine, "/docker-machine") == -1:
        print("Could not find docker-machine in our path")
        exit()

    f = os.popen('%s ip default' % docker_machine)
    ip = str(f.read()).strip()

    # Set our master and read-only end points and create our test bucket
    self.master_url = "http://%s:8888/v1/" % ip
    self.read_only_url = "http://%s:8889/v1/" % ip
    self.credentials = ('testuser', 'abc123')
    self.master = Client(server_url=self.master_url, auth=self.credentials)
    self.read_only = Client(server_url=self.read_only_url, auth=self.credentials)
    self.bucket = self.get_timestamp()
    self.master.create_bucket(self.bucket)
    self.read_only.create_bucket(self.bucket)
~~~

As with all code examples I put up here, I'm open to feedback and corrections.

## Time for that test

The scenario I'm going to share is a very simple one that accurate duplicates
a use case: someone alters the collection of data and those changes need to
get replicated over to a different server.

The test should make sense because I made sure to add comments

~~~
def test_sync(self):
    # Generate some random records
    collection = self.get_timestamp()
    self.master.create_collection(collection, bucket=self.bucket)
    self.read_only.create_collection(collection, bucket=self.bucket)
    for x in range(10):
        self.read_only.create_record(
            data=self.generate_record(),
            bucket=self.bucket,
            collection=collection)

    # Pause and generate some more random records on the master end-point
    time.sleep(3)
    for x in range(5):
        self.master.create_record(
            data=self.generate_record(),
            bucket=self.bucket,
            collection=collection)

    # Get the timestamp of our last record by doing an HTTP query of the
    # read-only collection and grabbing the value from the header
    response = self.read_only.get_records(bucket=self.bucket, collection=collection)
    last_record = response[-1]
    since = last_record['last_modified']

    # Query the master using that value for all the records since that one
    new_records = self.master.get_records(bucket=self.bucket, collection=collection, _since=since)

    # Add those records to our read-only end-point
    for data in new_records:
        new_data = {'internal_id': data['internal_id'], 'title': data['title']}
        self.read_only.create_record(data=new_data, bucket=self.bucket, collection=collection)

    master_records = self.master.get_records(bucket=self.bucket, collection=collection)
    read_only_records = self.read_only.get_records(bucket=self.bucket, collection=collection)

    # We should have 5 records in master and 15 in read-only
    self.assertEquals(5, len(master_records))
    self.assertEquals(15, len(read_only_records))

    # Clean up our collections
    self.master.delete_collection(collection, bucket=self.bucket)
    self.read_only.delete_collection(collection, bucket=self.bucket)
~~~

Again, very straight forward. Like I've told people many times -- writing tests
is just like writing code, and the test code doesn't need to be fancy. It just
needs to accurate execute the test scenario you have in mind.

## Always Be Evaluating

As a tester I'm always looking for tools that I think can provide real value to
me and help with testing scenarios. It's still early days with Docker and it
(along with associated tools) are only getting better. If you've been struggling
with a way to try and build a reasonably-sandboxed environment to run functional
tests in, I encourage you to take a look at what I've done here and copy it to
your advantage.

The tests I've been working on can be found inside [this GitHub repo](https://github.com/mozilla-services/services-test)
