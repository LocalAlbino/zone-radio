Zone Radio
===

Zone Radio is a gaming companion app designed to connect with the Spotify API and allow for playback control while gaming.
Inspired by the PDA Radio in the S.T.A.L.K.E.R. series, it enforces that you've properly paused your game prior to allowing
changes.

NOTE
---

Due to recent changes in the Spotify API's usage model, I'm not able to use my API key to authenticate other users.
If you're interested in using this app on your own, you'll need to register an app with their API as well. 
You'll need to go configure the `auth.clientId` and `auth.redirectUri` fields inside of `src/api/auth.ts`.
If I can find the time, I'd like to add fields to the UI so that you don't need to go in and change these manually.
Sorry :(

Building The Project
---

Due to the fact that you'll need to manually edit some of the source to set this up on your own, I haven't provided any binaries here.

You can run one of the following commands to build the project:

```bash
npm install # Ensure you have all necessary dependencies first

npm run build:win # Windows build

npm run build:mac # MacOS build

npm run build:linux # Linux build
```

After building, you should see the executable inside of the `dist` directory.
