# NoName v1


### Table Of Contents
- [Description](#description)
- [Features](#features)
- [How To Use](#how-to-use)

---

## Description
NoName is a modern forum software powered by NuxtJS and NodeJS. Currently only supporting MongoDb database.

NoName v1 is not yet ready for production use.

View [Demo here](https://noname.red)


## Features
- Categories
- Threads
- Posts
- Wall Posts
- Authentication: Local, Facebook (WIP), Twitter (WIP), Discord (WIP), Google (WIP)

## How To Use
> It is recommended to install and configure the backend first. [Backend](https://github.com/Savvy/noname-backend)

### Installation
To install and run the backend project, ensure you have entered the proper environment variables:

```
CLIENT_URL=
MONGO_CONNECTION=
SESSION_SECRET=
SENTRY_LOGGING=false
SENTRY_DSN=
DISCORD_ID=
DISCORD_SECRET=
DISCORD_CALLBACK=
TWITTER_KEY=
TWITTER_SECRET=
TWITTER_CALLBACK=
SMTP_SERVICE=
SMTP_PORT=
SMTP_AUTH_USER=
SMTP_AUTH_PASS=
```

Then run the following commands:
```
npm install
# The below command is optional if you'd like sentry error tracking.
npm install @sentry/node @sentry/tracing
npm run start
```


## More Information
- [Demo](https://noname.red)
- [Backend](https://github.com/Savvy/noname-backend)

[![](https://i.imgur.com/gp00w0H.png)](https://i.imgur.com/gp00w0H.png)
[![](https://i.imgur.com/2Y7IGvB.png)](https://i.imgur.com/2Y7IGvB.png)
[![](https://i.imgur.com/5aoywlZ.png)](https://i.imgur.com/5aoywlZ.png)
[![](https://i.imgur.com/EeI5ufW.png)](https://i.imgur.com/EeI5ufW.png)
