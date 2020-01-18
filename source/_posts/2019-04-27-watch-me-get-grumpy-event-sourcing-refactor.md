---
layout: post
title: "Watch me get grumpy - event sourcing refactor"
author: Chris Hartjes
date: 2019-04-27
---

As I continue to build out [OpenCFP Central](https://opencfpcentral.com) I
wanted to share with you some of the work I have been doing to move it from
your typical [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
structure to something a little more robust -- [CQRS](https://www.martinfowler.com/bliki/CQRS.html)
and [event sourcing](https://www.martinfowler.com/eaaDev/EventSourcing.html).

So at the time I wrote this, I had two problems I needed to solve:

* how to refactor existing code for talk creation to support CQRS+ES
* how to go back and create events for data that already exists

Solving the first problem appears straightforward. This is a [Laravel 5.8](https://laravel.com/docs/5.8)
application, so I spent time looking at some different packages that I thought
could help me implement the core features that I needed for event sourcing
quickly. My first research lead me to two solutions tailored towards PHP: 

* [Prooph](http://getprooph.org/)
* [EventSauce](https://eventsauce.io/docs/)

The problem I quickly ran into was there was some friction in using
these packages with Laravel. They both are very powerful, but you will
end up spending a lot of time writing the wiring and/or glue yourself.
That was time that I felt I did not have. After all OpenCFP Central
is a project I can only really devote 1-2 days a week on. I needed
some help to implement the basic concepts and let me build stuff
quickly.

Like with a lot of problems I try and solve over the years, sometimes
if you wait long enough someone else will create the solution for you!

I discovered that [Freek Murze](https://twitter.com/freekmurze) had been
tweeting about [Laravel Event Projector](https://docs.spatie.be/laravel-event-projector/v2/introduction).
This turned out to be exactly what I needed to get started. 

So, I need to go backwards and first figure out how do I take the
existing data we have and create events from it. The work I needed
to do will be used when I go and refactor the existing user registration
code to support the new event sourcing.

What do I need to start?

* An [aggregate](https://docs.spatie.be/laravel-event-projector/v2/getting-familiar-with-event-sourcing/using-aggregates-to-make-decisions-based-on-the-past) that represents a talk 
* An event that needs to be triggered to create our talk aggregate
* A script that reads in the existing data and creates those events.

The aggregate looks like this:

```php
declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\User\Events\UserCreated;
use Spatie\EventProjector\AggregateRoot;

final class UserAggregateRoot extends AggregateRoot
{
    public function createUser(string $email, string $name, string $password)
    {
        $this->recordThat(new UserCreated($email, $name, $password));

        return $this;
    }
}
```

Remember, all I'm storing is the data about this user that is
important to the system. It will automatically create a UUID that
belongs to this aggregate. I'll worry about what ends up in the
database we will *read* information from when I create a 
[projector](https://docs.spatie.be/laravel-event-projector/v2/getting-familiar-with-event-sourcing/using-projectors-to-transform-events)
to extract data from the event store.

Next, I have to create the code for the event that will
in turn generate our user aggregate.

```php
declare(strict_types=1);

namespace App\Domain\User\Events;

use Spatie\EventProjector\ShouldBeStored;

final class UserCreated implements ShouldBeStored
{
    /** @var string */
    public $email;

    /** @var string */
    public $name;

    /** @var string */
    public $password;

    /**
     * UserCreated constructor.
     * @param string $email
     * @param string $name
     * @param string $password
     */
    public function __construct(string $email, string $name, string $password)
    {
        $this->email    = $email;
        $this->name     = $name;
        $this->password = $password;
    }
}
```

It takes the user information passed into it and assigns it to
class attributes.

Finally, I will create a console command that I can execute
with `php artisan` that will loop through all my existing
user records, storing aggregates for them.

```php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\User\UserAggregateRoot;
use App\User;
use Illuminate\Console\Command;
use Ramsey\Uuid\Uuid;

class GenerateUserCreatedEvents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:generate_user_events';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set an existing user to be an admin';

    public function handle() : void
    {
        foreach (User::all() as $user) {
            UserAggregateRoot::retrieve((string) Uuid::uuid4())
                ->createUser(
                    $user->email,
                    $user->name,
                    $user->password
                )
                ->persist();
        }
    }
}
```

The `UserAggregateRoot` uses some magic behind the scenes to
then take the data I submitted and write it to the event store.

So what ends up being stored in the events table? In my current
test environment I have exactly one user and here's a
slightly-edited version of what got created.


```
id               | 4
aggregate_uuid   | 2b5f88da-1f51-4443-a080-c566c04d452e
event_class      | App\Domain\User\Events\UserCreated
event_properties | {"email":"chartjes@grumpy-learning.com","name":"Chris Hartjes","password":"clearlynotmypassword"}
meta_data        | []
created_at       | 2019-04-26 19:31:44
```

Again, I remind you to understand the central concept
that we are creating events that do not necessarily map
exactly to what ends up in a database. One of the central
parts of CQRS is that by separating the "command" (typically
writing something to a database) from the "query" (typically
reading something from a database). This gives me the
flexibility to have multiple database tables that can
display information in different ways. This is especially
useful for domains where multiple types of reports are
required. Multiple tables with exactly the data you need
are, in my opinion, better than one big table where you
have to create customized queries to filter out, and group,
and aggregate things you are looking for.

First, I need to modify the controller method that
handles user creation to create an aggregate instead
of directly writing to the database.

Here's what it looks like right now:

```php
/**
* Create a new user instance after a valid registration.
*
* @param  array  $data
* @return \App\User
*/
protected function create(array $data) : User
{
	return User::create([
	    'name' => $data['name'],
	    'email' => $data['email'],
	    'password' => Hash::make($data['password']),
	]);
}
```

Here's what it does instead:

```php
protected function create(array $data) : User
{
	$newUuid = (string) Uuid::uuid4();
        UserAggregateRoot::retrieve($newUuid)
            ->createUser(
                $data['email'],
                $data['name'],
                Hash::make($data['password'])
            )
            ->persist();

        return User::where('email', $data['email'])->first();
}
```

Now, this is not exactly normal behaviour in a CQRS+ES
application. Because Laravel's Auth system was not created
with this is in mind, I had to cheat a little to make
the use registration system behave correctly.

Next I need to create a projector that will be triggered
whenever the `UserCreated` event happens.

```php
declare(strict_types=1);

namespace App\Domain\User\Projectors;

use App\Domain\User\Events\UserCreated;
use App\User;
use Spatie\EventProjector\Projectors\Projector;
use Spatie\EventProjector\Projectors\ProjectsEvents;

final class UserProjector implements Projector
{
    use ProjectsEvents;

    public function onUserCreated(UserCreated $event, $aggregateUuid) : void
    {
        User::create([
            'name' => $event->name,
            'email' => $event->email,
	    'password' => $event->password
        ]);
    }
}
```

Alert readers will notice this is what the old controller method
used to do.

Any projectors you write will be automatically detected and
registered by the application.

So there you have it! A successful refactor of some existing
code to support a new underlying paradigm. There is still
more work to do and I'll share some of it in another blog post
soon.
