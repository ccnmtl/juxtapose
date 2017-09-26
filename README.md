# juxtapose [![Build Status](https://travis-ci.org/ccnmtl/juxtapose.svg?branch=master)](https://travis-ci.org/ccnmtl/juxtapose)

[![Greenkeeper badge](https://badges.greenkeeper.io/ccnmtl/juxtapose.svg)](https://greenkeeper.io/)

Video Juxtaposition Tool

## Development Notes
Juxtapose is meant to be used in the Mediathread environment, because it
relies on things specific to Mediathread, like the CollectionList. Here
I'll outline some logistics around developing this tool in Mediathread.

I'm developing Juxtapose in this git repository because it's easier to make
changes here. Mediathread has an elaborate testing setup of its own that we
don't need to go through when making changes to Juxtapose.

Juxtapose interacts with Mediathread through a few JavaScript functions and
some AJAX calls. Juxtapose's core interface functionality is independent of
Mediathread, so a lot of it can be developed and tested separately.

It's still essential to do manual testing within Mediathread, and here's
how I'm doing that:

* `cd mediathread`
* `rm media/juxtapose/bundle.js`
* `ln -s ~/public_html/juxtapose/build/bundle.js media/juxtapose/bundle.js`
* `make runserver`

Then, in a new terminal:

* `cd ~/public_html/juxtapose`
* `make dev`

Now you can make changes in the Juxtapose repository, and the build will be
updated when you access the tool in Mediathread.

## Deployment
Here's how I'm currently pushing this code to Mediathread:
* Run `make build`
* Copy `build/bundle.js` to `mediathread/media/juxtapose`
* Commit the compiled code to Mediathread

I'm planning on figuring out how to bundle this with npm, so this process
might improve in the future.
