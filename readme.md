# LeapML Discord Bot

The official discord bot for [LeapML](https://leapml.dev)! This bot allows anyone in your server to interact with their LeapML account, including training models, generating images, and even editing images 🔥

<b>note:</b> the old version is in `original` branch. the old bot used 1 API key for all users, provided by the admin.

<!-- create a  button to invite the bot to your server -->
<a href="https://discord.com/api/oauth2/authorize?client_id=86753098675309&permissions=8&scope=bot">
  <img src="https://img.shields.io/badge/Invite%20to%20your%20server-7289DA?style=for-the-badge&logo=discord&logoColor=white" alt="Invite to your server" />
  </a>

## Contributing & Self Hosting

### Basic Setup

1. Fork this repo & download it
2. Head to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application
3. Go to the bot tab and add a bot, allow it to send messages, and copy the token
4. Add the token to the .env file following the format in the .envExample file
5. Create a firebase project with firestore enabled
6. Go to `settings` > `service accounts` and click `generate new private key`
7. Add the .json file to the root of the project and rename it to `creds.json`

### Running the bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications), head to `OAuth2` > `scopes` and check `bot` and `applications.commands` and click the link to invite the bot to your server
2. For both `/api` and `/bot` (in prod, we use a digital ocean droplet)
   a) Run `npm install` to install the dependencies
   a) Run `npm start` to start the bot

### Commands

1. `/train` - Train a model
2. `/generate` - Generate images
3. `/edit` - Edit images (coming soon, waiting for api)

#

#### Links

- [LeapML](https://leapml.dev)
- [LeapML Discord](https://discord.gg/leapml)
- [Tweet Demo](https://twitter.com/aleemrehmtulla/status/1626649421164453889)
