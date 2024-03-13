# The ninaivu web portal

To start development, you'd need to setup mongodb in your machine.

A handy docker compose file is provided in the contrib folder.
To use it, run the following from the root project folder.
All this will do is setup a mongodb docker instance on your machine.

```
$ docker compose -f contrib/docker-compose--dev.yml up
```

## Guide for running the application

0. Ensure mongodb is running.

```sh
$ cp .env.example .env
$ nvm use
$ npm i
```

Examine the `.env` file.

1. Create atleast one admin user with

```sh
$ NINAIVU_EMAIL=foo@gmail.com \
NINAIVU_FULLNAME="Jimmy Jane" \
NINAIVU_PASSWORD="JimmyFoo98Th" \
node contrib/create-user.js
```

This will create an admin user with login credentials `foo@gmail.com` and password `JimmyFoo98Th`.

2. Then run the application with

```
$ npm start
$ # (or)
$ node app
```

## Development

```
$ cp .env.example .env
$ nvm use
$ npm i
$ npm run dev
```

**Happy Hacking!**
