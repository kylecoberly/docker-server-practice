# Building a Simple API with Docker

## The Problem

Let's say you're switching everything in your node codebase over to `import`/`export` syntax.

```
// Sooooo yesterday
// const express = require("express")
import express from "express"
```

Everything works locally. You push your repo to Heroku and womp womp- immediate errors. Worse, half of your team has the error too and no one can figure out why.

### Containers to the Rescue

`import`/`export` was added to node in version 12. If you, your teammates, or your server are using slightly different versions, you will have a difficult to diagnose problem on your hands.

## Follow Along

Add a file called `Dockerfile` (no extension) to the root of your project. This is like a picking list that describes what will be in the shipping container. We want to load the container like this:

```docker
# To build this container, you need...
# A linux instance with node 12 preinstalled
# Then copy all the files from this folder to `/app` inside the container
# Then, inside the container, `cd` into the `/app` directory
# Then, insider the container, run `npm ci` to install dependencies
# Then, whenenver you run this container, run `npm start`
```

In Dockerese, this looks like this:

```docker
FROM node:12
COPY . /app
WORKDIR /app
RUN npm ci
CMD npm start
```

Then build the Dockerfile into an image:

```bash
# Hey Docker, can you pack up a container for me named "docker-server" based on the picking list in this folder?
sudo docker build -t docker-server .
```

This is like loading up the shipping container with our app. If we want to see what it's going to look like when someone "unloads" the shipping container, we can run it with this command:

```
# Hey docker, run the image called `docker-server` in the background, and whatever happens on our port 4000 should be sent to its port 80.
sudo docker run -d -p 4000:80 docker-server
```

This will run the server until you tell it to stop. To stop the server, run `sudo docker kill the-first-few-characters-of-the-container-id`. For example:

```
$ sudo docker run -d -p 4000:80 docker-server
db39a6a0907985652e3e00fad050efc3a228920eb8bb4f2c30506846c7c4cf98

$ sudo docker kill db3
```

The container ID is returned when you run a docker command with `-d`, and you can also find it with `sudo docker container ls`.

## Deployment

### One-time Heroku Setup

* Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
* Login with `heroku login`

### One-time App Setup

* `heroku create app-name-goes-here`
* `heroku stack:set container`

This creates the app, and tells it that we'll be using docker containers instead of any of Heroku's built-in "buildpacks". We still need to tell Heroku how to build and run our app:

```
# Hey Heroku,
# When you build the app in this repo,
# Note that it's a Docker container,
# And the instructions to build it can be found in a file in this folder called `Dockerfile`
# Whenever it's done building, run `npm start`
```

Add a `heroku.yml` file to the root of the folder that says that in Herokuese:

```
build:
  docker:
    web: Dockerfile
run:
  web: npm start
```

### Deployment

Run `git push heroku master`, and in a short while your app will be running publicly on Heroku in an identical environment to the one you ran locally!
