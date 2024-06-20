# Live Events Application

## Demo

A hosted version of the demo can be found **[here](https://ui-kit-with-pubnub.vercel.app/)**.

![Screenshot](https://www.pubnub.com/cdn/3prze68gbwl1/6RXpUoMCMTnwDEY1ekNEO9/0722922649400bd1d79ba469a133a406/Screenshot_2024-05-14_at_2.09.28_PM.png?fm=avif&w=700&h=550&fit=pad)

## Features of the Live Events Application and PubNub SDK used

| Feature | Description | APIs/Primatives used |
| ---- | --- | ---------------- |
| Chat | Uses the [PubNub Chat SDK](https://www.pubnub.com/docs/chat/chat-sdk/overview) to show how a a chat application can be implemented with a public channel with features such as history, precense, metadata, delete/restore messages. | [Public Channels](https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/create#create-public-channel), [Join Channels](https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/join), [Create User](https://www.pubnub.com/docs/chat/chat-sdk/build/features/users/create), [Presence](https://www.pubnub.com/docs/chat/chat-sdk/build/features/users/presence), [Send/Receive](https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/send-receive), [History](https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/history), [Delete Message](https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/delete), [Restore Message](https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/restore) |
| Broadcasting | Shows how Livepeer can make a real-time livestream with control over live playback, quality, and video/audio settings. | [Player](https://docs.livepeer.org/developers/core-concepts/player/overview), [Livestream Playback](https://docs.livepeer.org/developers/guides/playback-a-livestream), [Stream](https://docs.livepeer.org/developers/core-concepts/core-api/stream) |
| Moderation | Uses the [PubNub Chat SDK](https://www.pubnub.com/docs/chat/chat-sdk/overview) to show how you can moderate your Live Events application by allowing users to report users/messages and on the other hand allowing the moderator or broadcaster to mute or ban users from the stream. | [Flag/Report Messages](https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/moderation), [Flag/Report Message](https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/moderation), [Mute/Ban Users](https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/moderation), [Profanity Filtering](https://www.pubnub.com/docs/serverless/functions/overview) |

## Installing / Getting started

To run this project yourself you will need a [PubNub](https://www.pubnub.com/) and [Livepeer](https://livepeer.studio/) account.

## Requirements

- [PubNub Account](#pubnub-account) (*Free*)

- [Livepeer Account](#livepeer-account) (*Free*)

### Get you PubNub Keys

1. You’ll first need to sign up for a [PubNub account](https://dashboard.pubnub.com/signup/). Once you sign up, you can get your unique PubNub keys from the [PubNub Developer Portal](https://admin.pubnub.com/).

1. Sign in to your [PubNub Dashboard](https://admin.pubnub.com/).

1. Click Apps, then **Create New App**.

1. Give your app a name, and click **Create**.

1. Click your new app to open its settings, then click its keyset.

1. Enable the Presence feature on your keyset (check 'Presence Deltas' and 'Generate Leave on TCP FIN or RST')

1. Enable the Message Persistence feature on your keyset and choose a duration

1. Enable the App Context feature on your keyset.  Make sure you check all the checkboxes related to events, i.e. User and Channel Metadata Events as well as Membership Events.

1. The hosted variant of this app uses Functions for moderation, specifically [https://www.pubnub.com/integrations/chat-message-profanity-filter/](https://www.pubnub.com/integrations/chat-message-profanity-filter/).

1. Copy the Publish and Subscribe keys and paste them into your app as specified in the next step.

### Building and Running

1. Clone the repository

1. In the file `.env.example` delete the extention `.example` and your keys here keeping the name of the keys the same.

## Contributing
Please fork the repository if you'd like to contribute. Pull requests are always welcome.

## Customization to change colors and demo content

- To modify the application theme, modify the colors located at `/tailwind.config.ts`.  Named colors are used throughout this application so changing them here will update the entire app.

## Further information

```js
chat.listenForEvents({
    channel: string;
    type?: "report";
    callback: (event: Event<"report">) => unknown;
}): () => void
```

For the moderator/broadcaster to listen to report events by users. Set this value to a dedicated `PUBNUB_INTERNAL_ADMIN_CHANNEL`  where all report events are sent.

## Server Component

You will need to set up a server component and replace the `baseURL` fround under `components/chat/api/moderation.ts` to point at your server. The server component ensures that your `PubNub Secret Key` is not stored on the client side of the application. All `ban/mute` functionality should happen on the server side of this demo as you will need to initialize your PubNub Instance with the `Secret Key`.

### Server Component Code

`Keys.js`

```js
const publish_key = 'publish_key'; //  ENTER YOUR PUBLISH KEY HERE
const subscribe_key = 'subscribe_key'; //  ENTER YOUR SUBSCRIBE KEY HERE
const secret_key = 'secret_key'; //  ENTER YOUR SECRET KEY HERE

const admin_key = 'admin'; //  ENTER ADMIN UUID HERE

module.exports = {
  publishKey: publish_key,
  subscribeKey: subscribe_key,
  secretKey: secret_key,
  userId: admin_key
}
```

`Moderation.js`

```js
const config_file = require('./keys.js')
const { Chat } = require("@pubnub/chat");

const setRestrictions = async (req, res) => {
  // Get PubNub Admin UUID
  const chat = await Chat.init(config_file);

  // Parse ChannelID
  const channelID = req.body.channelID;
  const userID = req.body.userID;
  const ban = req.body.ban;
  const mute = req.body.mute;

  if (channelID == null || userID == null) {
    return res.status(500).send({
      message: 'Error: channelID or userID was called on null. Ensure content-type is application/json and the POST request contains a channelID and a userID parameter'
    })
  }

  if(ban == null){
    return res.status(500).send({
      message: 'Error: Have to include the current ban status when muting a user'
    })
  }

  // If the channel has been created grab the channel object
  const channelInstance = await chat.getChannel(channelID);
  const userInstance = await chat.getUser(userID);

  if(channelInstance == null || userInstance == null){
    return res.status(500).send({
      message: `Error: No channel instance matches the ID: ${channelID} or No user Instance matches the ID: ${userID}`
    })
  }

  await channelInstance.setRestrictions(userInstance, {
    ban: ban,
    mute: mute,
    reason: "Restricted by admin",
  });

  return res.status(200);
}

const deleteMessage = async (req, res) => {
  // Get PubNub Admin UUID
  const chat = await Chat.init(config_file);

  const messageID = req.body.messageID;
  const channelID = req.body.channelID;

  // If the channel has been created grab the channel object
  const channelInstance = await chat.getChannel(channelID);

  if(channelInstance == null){
    return res.status(500).send({
      message: `Error: No channel instance matches the ID: ${channelID}`
    })
  }

  const message = await channelInstance.getMessage(messageID);

  // Soft delete a message so it is able to be restored
  await message.delete({
    soft: true,
  });

  return res.status(200);
}

const restoreMessage = async (req, res) => {
  // Get PubNub Admin UUID
  const chat = await Chat.init(config_file);

  const messageID = req.body.messageID;
  const channelID = req.body.channelID;

  // If the channel has been created grab the channel object
  const channelInstance = await chat.getChannel(channelID);

  if(channelInstance == null){
    return res.status(500).send({
      message: `Error: No channel instance matches the ID: ${channelID}`
    })
  }

  const message = await channelInstance.getMessage(messageID);

  await message.restore();

  return res.status(200);
}
```
