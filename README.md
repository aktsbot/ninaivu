# The ninaivu web portal

To start development, you'd need to setup mongodb in your machine.

A handy docker compose file is provided in the contrib folder.
To use it, run the following from the root project folder.
All this will do is setup a mongodb docker instance on your machine.

```
$ docker compose -f contrib/docker-compose--dev.yml up
```

## Dev

```
$ cp .env.example .env
$ nvm use
$ npm i
$ npm run dev
```

**Happy Hacking!**
