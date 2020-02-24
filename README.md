We're going to load up a shipping container, put it on a truck, and send it off to serverland.

## Simple Servers

Let's say you're switching everything in your node codebase over to `import`/`export` syntax.

```
// const express = require("express")
import express from "express"
```

Everything works locally. You push your repo to Heroku and womp womp- immediate errors. Worse, half of your team has the error too and no one can figure out why.

### Containers to the Rescue

`import`/`export` was added to node in version 12. If you, your teammates, or your server are using slightly different versions, you will have a difficult to diagnose problem on your hands.

After downloading Docker, follow these steps:



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

This is like loading up the shipping container with our app. If we want to see what it's going to look like when someone unloads the app, we can run the container with this command:

```
# Hey docker, run the image called `docker-server` in the background, and whatever happens on our port 4000 should be sent to its port 80.
sudo docker run -d -p 4000:80 docker-server
```

This will run the server until you tell it to stop. To stop the server, run `sudo docker kill [the-first-few-characters-of-the-container-id]`. The container ID is returned when you run a docker command with `-d`, and you can also find it with `sudo docker container ls`.

## Deployment

Install the Heroku Toolbelt and login. Then,

* `heroku create app-name-goes-here`
* `heroku stack:set container`

Add a `heroku.yml` file to the root of the folder.
