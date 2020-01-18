---
layout: post
title: "Watch Me Get Grumpy -- Zend Expressive Doctrine Configuration"
author: Chris Hartjes
date: 2019-03-17
---

I am in the process of starting the dreaded Rewrite Of An Existing Application
That Works. In this case, it is time that I turned [OpenCFP](https://github.com/opencfp/opencfp)
from a install-it-yourself web application into a Software-As-A-Service offering.

As part of this rewrite I have decided to use [CQRS](https://www.martinfowler.com/bliki/CQRS.html)
and [Event Sourcing](https://www.martinfowler.com/eaaDev/EventSourcing.html) instead
of the traditional CRUD-backed-with-a-DB architecture that most of the
web is built on.

I believe that an application that has so many domain-specific events associated
with it will benefit greatly from the ideas underpinning CQRS and Event Sourcing.
Anyway, the architecture is not up for debate since I'm the one doing it!

This app is going to replace what I already created at [OpenCFP Central](https://opencfp-central.com)
and I will cut over to this new one once I have implemented the two existing
features:

* allowing people to register accounts
* allowing people who are running OpenCFP to use OpenCFP Central for single-sign-on

Because there is so much reworking to be done with the OpenCFP code base to make it
a SaaS capable of hosting multiple events, I felt it was better to start fresh
with the code base. Especially because I now need to add all the CQRS+ES implementation.

The existing version of the application is a standard CRUD-backed-with-a-DB that was
built using [Laravel](https://laravel.com). My research into figuring out how to
add CQRS+ES led me to believe that I did not have the requisite knowledge of the
framework to figure out how to make it work. Laravel is great in that it has lots
of packages and add-ons to allow you to quickly build something. I felt like this
was not going to help me in this case. Laravel is good! But not a great fit for
someone with my level of expertise with it. 

So I decided to use [Zend Expressive](https://zendframework.github.io/zend-expressive/)
as the framework to build this app. My online network of friends includes many 
people who have used the framework, and one of the best and most thorough examples
of how to build an application using CQRS+ES was done by [Marco Pivetta](https://twitter.com/ocramius)
and it was backed by Zend Framework and uses [Prooph](http://getprooph.org/) for
CQRS+ES functionality.

(As an aside, using Zend Expressive has reminded me how much I have relied
on 'batteries included' frameworks in recent years. Forcing myself to also
write glue code is actually a good thing for me)

So, I knew the framework, I knew what I could use for CQRS+ES. Now it was time
to install some other tools to help me build out this version of OpenCFP.

I was going to require some sort of tool to create database migrations
as the app gets built. I was also learning towards trying not to use
an ORM but instead something like [Doctrine DBAL](https://www.doctrine-project.org/projects/dbal.html)
so I decided to also use [Doctrine Migrations](https://www.doctrine-project.org/projects/migrations.html)
since it can be used with our without the ORM.

I found some great examples of how to set things up...and it just
wouldn't work for me. The steps seemed straightforward and I highly
recommend watching Adam Culp's Beachcasts tutorial on [configuring Doctrine ORM and DBAL](https://www.youtube.com/watch?v=pFvh5ZNhdOQ). I had my database configured and working.
I added in the code to allow the Zend Service manager to locate
Doctrine as required. The examples said "this should work just
fine with DBAL." 
I had the 'migrations.php' and 'migrations-db.php' file and it Just
Wouldn't Work.

Until I realized the key critical thing I had hand-waved and did not
think anything off -- environment variables.

The app is going to be deployed to Heroku, where I can set environment
variables that can be accessed by code, both in a CLI and web environment.
I use environment variables in my work at [the day job](https://mozilla.com)
so why wouldn't I do that here?

This is what my 'migrations-db.php' file looked like:

```php
<?php
declare(strict_types=1);

return [
    'driver' => 'pdo_pgsql',
    'dbname' => \getenv('DB_DATABASE'),
    'user' => \getenv('DB_USER'),
    'password' => \getenv('DB_PASSWORD'),
    'host' => \getenv('DB_HOST')
];
```

When I would run the migration tool it would spit out errors telling me
it could not read the database configuration file and a bunch of other
noise that just made me grumpier and grumpier as I struggled to figure
out what was wrong.

Eventually I decided to see what as actually inside those environment
variables. To my surprise there were empty! Ugh. But I did know what
I could do to fix it. I would make use of Vance Lucas' [dotenv](https://github.com/vlucas/phpdotenv)
tool to make sure the contents of my own '.env' file would be
available.

After installing it using [Composer](https://getcomposer.org) as per
the documentation, I added this code to my 'migrations-db.php' file:

```php
use Dotenv\Dotenv;

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::create(__DIR__);
    $dotenv->load();
}
```

Now the migrations tool worked just fine, and I was on my way towards
the first step of the app -- building the user registration system
and making sure authentication worked correctly.

If you have any comments or suggestions, please reach out to me via
Twitter (my preferred way) or you can email me at chartjes@grumpy-learning.com.
