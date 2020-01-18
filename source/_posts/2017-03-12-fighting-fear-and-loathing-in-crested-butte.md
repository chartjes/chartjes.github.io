---
layout: post
title: "Fighting Fear and Loathing In Crested Butte"
author: Chris Hartjes
date: 2017-03-12
comments: true
sharing: true
---
This past week (March 5th-10th) I went to Crested Butte, Colorado to attend
the [Winter Tech Forum](http://www.mindviewinc.com/Conferences/JavaPosseRoundup/)
with my fellow Mozillian [Matt Brandt](https://twitter.com/m8ttyb). He'd been
encouraging me for about a year to come out for a visit and see the conference
for myself.

I went intending to push myself out of my comfort zone. I pushed a little too
hard.

WTF (pretty sure it was named this on purpose) is an Open Spaces conference.
This means that there are no set speakers -- attendees self-organize and the
goal is really for smaller sessions where it's more of a discussion than
your traditional lecture-style session. It seems to me it leans more towards
having a number of attendees in the 30-40 range -- Bruce Eckel, one of the
organizers for this event, mentioned he felt things started to change once
you get up to 50 people. This year's event was just a little over 20.

So, the first thing that caused me some stress was the very first session where
Bruce explained how everything worked and the attendees introduced themselves.
When it was my turn I introduced myself and talked about how I came into this
event with no expectations and was going to try and just go with the flow.

It was very strange to go from being a known quantity after all these years of
giving talks at PHP conferences to being absolutely nobody at this event. I'm
not going to lie -- it was a very uncomfortable feeling for me. There were four
newcomers, I only knew Matt, and it seemed like EVERYONE ELSE knew each other.

So the sessions started going and there were some interesting discussions:

* a quick intro to Machine Learning led by someone who worked for a consultancy specializing in it
* I led a discussion about how I manage social media and a discussion about whether or not to interact with haters and trolls
* offered some input and my experiences to a discussion on remote working

The afternoons were ours to do with as we wished. A lot of attendees liked to
ski or do other activities. Since I am usually against sweating while outdoors,
I retreated to my charming little Airbnb and kept on doing a big refactor of
[OpenCFP](https://github.com/opencfp/opencfp) to add in consistency for the
use of forms and replacing Sentry (the authentication and authorization library)
with it's replacement from Caratalyst, [Sentinel](https://cartalyst.com/manual/sentinel/2.0).

Tuesday was more of the same -- open discussions in the morning and then we
were free to do whatever we wanted in the afternoons. Tuesday's sessions for me were:

* Matt led a discussion on app and web accessibility issues
* What had people done with hardware devices and ideas for the Wednesday hack day

I didn't go to the last sessions, I instead went to go hack some more on OpenCFP
in order to have something to show off on Wednesday night. Had some lunch at
one of the many fine restaurants in Crested Butte, and went back to my Airbnb.

Wednesday I spent the entire day working on more OpenCFP stuff -- adding tests
to the application is a very slow and deliberate process and I am trying to
be a Good Open Source Project Maintainer. After dinner everyone went back to
the conference venue (the local parish hall) and I fought against my fear
and loathing by going first and doing a quick 5 minute demo of OpenCFP.
What else did we see?

* demo of using machine learning to detect angry tweets
* demo of a Slack bot that uses Markov chains of some Twitter accounts to generate output
* [Alexa](https://developer.amazon.com/alexa)-as-a-mentalist demo
* Using an Echo dot to turn a disco ball off and on
* Adding some Alexa skills to give people information about Crested Butte
* A [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck) compiler written in [Clojure](https://en.wikipedia.org/wiki/Clojure)
* Using a [Leap Motion](https://www.leapmotion.com) controller to allow people to cast spells from Harry Potter by hand
* A quick demo of [Pony](https://ponylang.org)

There were two other demos that I cannot remember and didn't take notes for, sorry folks.

Dinner that night was at an awesome restaurant that specialized in dishes for
sharing -- the 12 of us had one of (almost) everything on the menu. Probably
the best $50 I ever spent on a dinner.

Then Thursday happened.

I went to some sessions but my brain wouldn't let go of a fear of going to the
progressive dinner event. It starts off by going to a house (many of the
attendees rented houses for the event) for appetizers, then a different
house for the main course, and a third place for dessert.

I watched sessions on:

* keeping things like login and passwords your app needs from being leaked out
* a jumpstart for a functional programmer getting into Python

Then I went back and hacked some more, had lunch, and went back to my Airbnb.

It's been a very long time since I've had a panic attack. The last time was
when I was going to do a joint talk with [Stuart Herbert](https://twitter.com/stuherbert)
at ZendCon and he couldn't come due to medical issues.

My brain just latched onto:

* 20 people
* you don't know any of them
* it's too many people in one small house
* I WILL NOT LET YOU GO

So I remained in my Airbnb and had a salad I had bought at the local grocery
store. I felt bad that I couldn't go -- but many of the attendees approached
me on Friday to lend me their support and tell me they have often felt the
same thing. That was the one big thing that made this event really, really
different -- everyone was 100% serious about giving yourself permission to
do as much or as little as you wanted at this event.

Friday was a much, much better day.

* Session for the new attendees to discuss their experience
* Integrating remote folks into your teams

Then the closing session where Bruce talked about his own experiences this
year, some changes he was thinking about, and his own plans for future
events like this in 2017. We went around the circle sharing our own
experiences and then we took off for lunch.

I went back to my Airbnb and worked on converting over a [CakePHP](https://cakephp.org)
application from 2.x to 3.4. Of *course* the ORM has changed things so I have
lots of work to do.

Then the finale of the event was awesome -- dinner at a yurt that you could
only get to my snowshoeing, skiing, or snowmobile. There were multiple starting
points depending on your own comfort level and experience level. I had decided
on the 1.5 mile starting point and would snowshoe in. I had never used snowshoes
before.

This time I felt comfortable having dinner with the whole group. The snowshoe
experience was not going to deter me from making it. 

In the end, the experience was GREAT. We walked as the sun set, great conversations
to be had and then a great dinner prepared in the yurt for us. I sat at a table
with all the other attendees named Chris (there were 4 of us) and I shared
the tale of my grandfather's experiences as a German soldier who got caught
in the [siege at Stalingrad](https://en.wikipedia.org/wiki/Battle_of_Stalingrad).

The return walk was even better -- walking in bright moonlight combined with
a great talk with an attendee about his upcoming job helping to build the
infrastructure for an autonomous car company. It made me regret not participating
in the progressive dinner the night before.

Saturday I got up early and Matt drove me back to Durango for my flights home.
Again, great chats with Matt over the 4-1/2 hour drive and I feel like we really turned a professional
relationship into a real friendship. My flights home were uneventful and I
grabbed my car from the off-airport valet parking around midnight.

So what are my big takeaways from this event?

First, it's really intimidating to get into meaningful discussions on any topic
with a group of strangers. By the end of the week I felt like these people
weren't strangers any more -- it felt more like work colleagues. It's clear
to me that the event (which is 10+ years old if I recall correctly) acts as
a support and networking group for these people. They really care about each
others' lives and careers. It was great to see.

The second thing is a bit of weird perspective from me. For a lot of people,
they get the impression that what they are doing is unique and then these
sort of events show you that others are doing or experiencing the same things.

I had always felt that what I was doing was very similar to other peoples' experiences.
Instead, I discovered much of my experience and views on remote working, personal management,
and communication skills are quite unique. Attendees told me they really liked
how I articulated my views on these topics and that they got a lot out of it.
Nice little boost for the ego, to be sure.

So, will I be back? I want to go back and immerse myself more into this
group. Hopefully I can convince [Ed](https://twitter.com/funkatron) to come
with me.

Thanks to Bruce for being so warm and welcoming and treating me like I had
been part of this forever. Extra special thanks to Matt for being my conference
buddy. I would not have gone to an event like this without knowing someone.

Finally, this event has made me wonder if my 2018 event idea (GrumpyCon) should
be something similar. I am moving in the summer and maybe I get lucky and
wherever I end up has the ability for me to allow me to host 30 people
for a week of in-depth discussions and experiences about PHP and other topics
people want to discuss.

