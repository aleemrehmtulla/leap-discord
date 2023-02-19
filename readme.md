# LeapML Discord Bot

Hi! I'm Aleem -- this is a lil project for the Leap hackathon. It's like the midjourney bot, but since we use Leap it allows you to train your own models 🪄

<b>note:</b> this bot has now been updated, this is the old version. this one relies on the discord admin to provide a leap api, and all generations go through one account. the main branch contains a new version, where we store info in a database, and each user must input their own api key.

https://user-images.githubusercontent.com/60443878/219637278-125b1fa9-0024-47a1-b20c-57f44e62f0ba.mp4

### Basic Setup

1. Fork this repo & download it
2. Head to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application
3. Go to the bot tab and add a bot, allow it to send messages, and copy the token
4. Add the token to the .env file following the format in the .envExample file
5. Check out [LeapML](https://leampl.dev) to create an account, and copy the api key
6. Add the api token to the .env file following the format in the .envExample file

### Running the bot

1. Run `npm install` to install the dependencies
2. Go back to the [Discord Developer Portal](https://discord.com/developers/applications), go to the OAuth2 tab, then URL generator, and click the link to invite the bot to your server
3. Run `npm start` to start the bot

### Commands

1. `/train` - Train a model
2. `/generate` - Generate images
3. `/edit` - Edit images (coming soon, waiting for api)

#

#### Links

- [LeapML](https://leapml.dev)
- [LeapML Discord](https://discord.gg/leapml)
- [Tweet Demo](https://twitter.com/aleemrehmtulla/status/1626649421164453889)
