---
layout: post
title: "A Different Twitter Experience"
author: Chris Hartjes
date: 2017-03-27
comments: true
sharing: true
---
It's no secret that I am on Twitter a lot. I mean, really a lot. Almost 100k
worth of posts a lot. But as I use it more and more I find I was spending
way more time treating Twitter as read-only, when what I wanted was to actually
interact with people! Maybe that is a naive position to take, but it is what
it is.

Then I stumbled upon this [blog post](https://elvery.net/drzax/the-list-cycle) 
where someone described an experiment they were trying out. The code for it
was written in Node and I couldn't get it to work so like any pragmatic programmer
I used the tools I am most comfortable with and [wrote a version in PHP](https://gist.github.com/chartjes/57e4470ef686d2fdcf5e496812d9fea1).

So every morning a cron job kicks off on a server and looks at the last 30
days of my Twitter timeline. It looks for users who I have "interacted" with
during that time frame. What is "interaction"? It's defined as:

* you replied to, favourited, or retweeted a tweet of mine
* you favourited or retweeted a tweet I was mentioned in
* I mentioned you in a tweet
* I replied to or favourited a tweet of yours

The results so far have been interesting. I definitely see a different group
of people on my feed than I have expected. Which is entirely the point! It
has made me *use* Twitter differently...which again is the point. I'm far freer
with my favourites and retweets than I was before. I'm also slowing down to
actually read my timeline rather than just scroll through it super quickly
like a trained monkey or something.

It's also making me be a lot less judgemental of the people who do end up on
this list. While some of the people I follow are definitely blasting out stuff
I am not all that interested in, I'm willing to take a chance and not just
mute them as soon as I don't like the minutiae of their life. Diversity is
a good thing and filter bubbles are not.

Another side effect of this has been some people proclaiming "I didn't know you
were following me!" when I say something to them. Hate to burst your bubble but
I'm not following you -- you are on my 'cycle' list and I can see your Tweets.

I know some folks follow accounts that send out emergency information and
things like that -- I work from home so things like that are not of great
use to me. YMMV etc etc.

If you're looking to have a different experience with Twitter, try my code out
and see what kind of list it can generate for you. I'm going to keep using this
for the near future because I feel like it's a worthy experiment. In fact, some
Twitter accounts I felt were essential to follow have just slid off the list
and I haven't missed them.

