# Multi device whatsapp microservice

- i am using [Baileys](https://github.com/WhiskeySockets/Baileys), which establishes direct web socket connection with the whatsapp servers, so i don't need to run whatsapp web in background and scarp things or use browser automation which is sometimes painful for me and servers's ram,

- i have modified the [Baileys-api](https://github.com/ookamiiixd/baileys-api) for my specific use case, i don't have any kind of need to store the old chat, i just want to send the messages(will store the messages in the db, when i will need to build some kind of automation bot but not now, want to keep things simple) 

- i am storing the session related info in the database, i can store them in local json file and use them, but for multi device it is not good, and consistent

- some terms and concept which you will have question:
    - SSE is for server sent events, in case want real time updates
    - jid: The jid is the identifier used by whatsapp for each or group. It use to be cc+phone@s.whatsapp.net for users and cc+phone-timestamp@g.us for groups.
    Some times it differs due to countries with area code. So, check your jid while registering in the returned string and check other users jid with contact info function or you will be banned.

- todo:

- [x] Creating basic routes and making it live
- [x] storing the session of the existing user and using them
- [ ] dockerising whole service
- [ ] setting up the ci/cd workflow to push it to docker hub


## Running docker file
 docker run --env-file .env  -p 3000:3000 wa-bailyes-1