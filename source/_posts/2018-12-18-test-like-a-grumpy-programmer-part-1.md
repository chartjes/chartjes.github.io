---
layout: post
title: "Learn To Test Like A Grumpy Programmer - Part 1"
author: Chris Hartjes
date: 2018-12-18
comments: true
sharing: true
---

(You can see more stuff like this blog post if you buy my ["Learn To Test Like A Grumpy Programmer" course](https://leanpub.com/c/learntotest) over at LeanPub)

I wanted to show folks how someone who has been writing tests for PHP in anger
since 2003 actually implements new features for a web site, driving them with
tests. 

More importantly, I want you to focus on how deliberate and methodical I am
in doing this work. I know it's an overused word, but discipline is a key
factor in successfully using a TDD approach for your tests. Skipping steps or
taking short cuts is a great way to end up with weird errors that you spend
a very long time debugging.

I am building [OpenCFP Central])(https://opencfpcentral.com), which is a companion
web application for [OpenCFP](https://github.com/opencfp/opencfp). OpenCFP is
a PHP web application that conference organizers can install and use to collect
talk submissions from prospective speakers.

OpenCFP Central is a 100% free service.

Right now you can register for an account with OpenCFP Central. For conference
organizers, you can obtain OAuth tokens so that people can use their OpenCFP Central
account to login and submit talk ideas to OpenCFP. This helps to reduce one of
the biggest complaints, which was "why do I have to keep creating OpenCFP accounts?!?"

The next feature I am building is allowing OpenCFP Central users to create talks and
store them there. Once I've built that out, then I will add functionality to OpenCFP
itself to retrieve a list of talks for a user who authenticated using OpenCFP Central
and allow one-click submission of the talk to that OpenCFP instance.

OpenCFP Central is being built using [Laravel](https://laravel.com) starting with
version 5.7. This is my first Laravel app but so many of the concepts it presents
are not revolutionary or even unexpected for folks who have been doing web
development with these "front controller style" web application frameworks.

So, with all that out of the way, let me show you how I implemented the first
bit of functionality of the new feature: displaying an empty talk creation
form for an authenticated user.

I started with a test that assumed everything was working:

```php
namespace Tests\Feature\Feature;

use App\User;
use Tests\TestCase;

class TalkPage extends TestCase
{
    /**
     * @test
     */
    public function it_displays_the_talk_form()
    {
        /**
         * As a logged-in user
         * When I follow the route for "click here to create a talk"
         * I should see the talk form being displayed
         */
        $user = Factory(User::class)->create();
        $response = $this->actingAs($user)
            ->get(route('create_talk'));
        $response->assertStatus(200);
        $response->assertSeeText('Create A Talk');
        $response->assertSeeText('Title');
        $response->assertSeeText('Description');
        $response->assertSeeText('Other Details');
    }
}
```

Of course, it failed because I did not have the route created. So I went and
added this route to `routes/web.php`

```php
Route::get('/talk/create', 'TalkController@create')->name('create_talk');
```

Now the test fails because I don't have a TalkController. I used the `artisan`
CLI tool to create an empty TalkController and modified it to use the `auth`
middleware.

```php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class TalkController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }
}
```

The test fails because I do not have the expected method for `TalkController`
created yet. Let's add that in:

```php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class TalkController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
    }
}
```

Test still failing (as expected) because it's not doing anything.
I'll add some code where I grab our authenticated user and ask
it to display a specific view.

``` php
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class TalkController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $user = Auth::user();
        return view('talk.create')
            ->with('user', Auth::user());
    }
}
```

Now the test fails because that view does not exist. I need to
create the appropriate directory structure to group views related
to talks and create a blank one that uses our existing layout.

```php
@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create A Talk</div>
                    <div class="card-body">
                        <p>
                            Use the form below to create a talk that can be submitted to OpenCFP instances that are
                            using OpenCFP Central
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
```

Test still fails because there is no form information in there. So I created
a partial view that contains the form fields I want. I did it without the
opening and closing form tags because I plan on reusing this form snippet
elsewhere. As part of a future test I need to modify this snippet to 
set default values as part of verifying you can actually succesfully
create or update a test. Sometimes it's okay to think a little bit ahead.
This strikes me as a very minor detail.

``` php
<div class="form-group">
    <label for="talk_title">Title</label>
    <input type="text" class="form-control" name="talk_title" />
</div>
<div class="form-group">
    <label for="description">Description</label>
    <textarea class="form-control" name="talk_description"></textarea>
</div>
<div class="form-group">
    <label for="other">Other Details</label>
    <textarea class="form-control" name="talk_other"></textarea>
</div>
```

Next I updated the main "create talk" view to use this form and wrapped
it form tags that POST the results to another method.

``` php
@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create A Talk</div>
                    <div class="card-body">
                        <p>
                            Use the form below to create a talk that can be submitted to OpenCFP instances that are
                            using OpenCFP Central
                        </p>
                            <form method="post" action="/talk/create">
                                @csrf
                                @include('talk.form')
                                <button type="submit" class="btn btn-primary">Create Talk</button>
                            </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
```

Now the test passes!

I hope this blog post helps you understand what a TDD flow with an app under
real conditions looks like.
