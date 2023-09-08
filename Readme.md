# whatsapp-bailyes-microservice

- i am using [Baileys](https://github.com/WhiskeySockets/Baileys), which establishes direct web socket connection with the whatsapp servers, so i don't need to run whatsapp web in background and scarp things or use browser automation which is sometimes painful for me and servers's ram,

- i have modified the [Baileys-api](https://github.com/ookamiiixd/baileys-api) for my specific use case, i don't have any kind of need to store the old chat, i just want to send the messages(will store the messages in the db, when i will need to build some kind of automation bot but not now, want to keep things simple) 

- i am storing the session related info in the database, i can store them in local json file and use them, but for multi device it is not good, and consistent

- some terms and concept which you will have question:
    - SSE is for server sent events, in case want real time updates
    - jid: The jid is the identifier used by whatsapp for each or group. It use to be cc+phone@s.whatsapp.net for users and cc+phone-timestamp@g.us for groups.
    Some times it differs due to countries with area code. So, check your jid while registering in the returned string and check other users jid with contact info function or you will be banned.
## Requirements

- **NodeJS** version **14.5.0** or higher
- **Prisma** [supported databases](https://www.prisma.io/docs/reference/database-reference/supported-databases). Tested on MySQL and PostgreSQL

## todo:

- [x] Creating basic routes and making it live
- [x] storing the session of the existing user and using them
- [x] dockerising whole service
- [x] setting up the ci/cd workflow to push it to docker hub
- [x] adding destroy, status, list methods and remaining methods
- [x] adding security token access so not everybody can access the microservice
- [] creating frontend to access the methods

## Installation

1. Download or clone this repo. If you want to skip the build step, you can use the [docker image](#docker-image)
2. Enter to the project directory
3. Install the dependencies

```sh
npm install
```

4. Build the project using the `build` script

```sh
npm run build
```

5. Run the project using the `start` script

```sh
npm run start
```

## API Docs

The API documentation is available online [here](https://documenter.getpostman.com/view/19263917/2s9Y5Zw2Qp). You can also import the **Postman Collection File** `(postman_collection.json)` into your Postman App alternatively

## Setup

1. Copy the `.env.example` file and rename it into `.env`, then update your [connection url](https://www.prisma.io/docs/reference/database-reference/connection-urls) in the `DATABASE_URL` field
1. Update your [provider](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#fields) in the `prisma/schema.prisma` file if you're using database other than MySQL
1. Run your [migration](https://www.prisma.io/docs/reference/api-reference/command-reference#prisma-migrate)

```sh
npx prisma migrate (dev|deploy)
```

or push the schema

```sh
npx prisma db push
```

Don't forget to always re-run those whenever there's a change on the `prisma/schema.prisma` file

if you don't want to do manually then you can run the following sql query in the  database
```sql
CREATE TABLE "Session" (
    "pkId" SERIAL NOT NULL,
    "sessionId" VARCHAR(128) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("pkId")
);

CREATE INDEX "Session_sessionId_idx" ON "Session"("sessionId");

```


## `.env` Configurations
```env
# Pino Logger Level
LOG_LEVEL=warn 

# Database Connection URL
DATABASE_URL=postgres://postgres:12345@localhost:5432/wa_service

# Reconnect Interval (in Milliseconds)
RECONNECT_INTERVAL=5000

# Maximum Reconnect Attempts
MAX_RECONNECT_RETRIES=5

# Auth token to validate the correct request
AUTH_TOKEN=supersecret
```

## Docker Image:
pull the image 
```
docker pull kmj007/whatsapp-bailyes-microservice
```

run the image with correct env path and port number
```
docker run --env-file .env  -p 3000:3000 -d kmj007/whatsapp-bailyes-microservice
```

run with limited memory:
```
docker run --env-file .env  -p 3000:3000 -d --memory=300mb --restart=always kmj007/whatsapp-bailyes-microservice
```

## local development:
- we are making images for multi platform so we are using buildx to do that
## local build:
```
docker buildx build --platform linux/amd64,linux/arm64 -t kmj007/whatsapp-bailyes-microservice:local  .
```
## local run:
```
docker run --env-file .env  -p 3000:3000 kmj007/whatsapp-bailyes-microservice:local
```

## Note:
if you have database running on the same machine and you are running container also on the same machine([stackoverflow](https://stackoverflow.com/questions/28056522/access-host-database-from-a-docker-container)):

please use `host.docker.internal` instead of `localhost`

spend around 3 hr behind this


## Notice

This project is intended for learning purpose only, don't use it for spamming or any activities that's prohibited by **WhatsApp**
