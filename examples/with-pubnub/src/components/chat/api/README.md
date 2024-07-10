# Code for the server side component

You will need to set up a server component to your application in order to remake this demo on your own keyset. This is because the `secret` key is needed in order to ban/mute users from a channel. The secret key should never be stored on your client side. To achieve this you can follow the code snippets below to re-make the API requests.

The server component consists of two files the `moderation.js` controller and the `keys.js` file. The `keys.js` file is for importing my `secret`, `publish`, and `subscribe` key into the `moderation.js` file to intialize a chat instance using the `chat.init()` function. The code can not be seen in this repo so hopefully this README.md file helps you set up your PubNub instance.

## Keys.js

Only used to store my publish, subscribe, and secret keys.

```js
const publish_key = "publish_key"; //  ENTER YOUR PUBLISH KEY HERE
const subscribe_key = "subscribe_key"; //  ENTER YOUR SUBSCRIBE KEY HERE
const secret_key = "secret_key"; //  ENTER YOUR SECRET KEY HERE

const admin_key = "admin"; //  ENTER ADMIN UUID HERE

module.exports = {
  publishKey: publish_key,
  subscribeKey: subscribe_key,
  secretKey: secret_key,
  userId: admin_key,
};
```

## Imports (moderation.js)

To get started import the `keys.js` file into `moderation.js` and `npm install @pubnub/chat` which can be found [here](https://www.npmjs.com/package/@pubnub/chat).

```js
const config_file = require("./keys.js");
const { Chat } = require("@pubnub/chat");
```

## Set Restrictions Request (moderation.js)

This function initializes a PubNub instance with the secret key and allows for a admin to ban/mute users.

```js
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
      message:
        "Error: channelID or userID was called on null. Ensure content-type is application/json and the POST request contains a channelID and a userID parameter",
    });
  }

  if (ban == null) {
    return res.status(500).send({
      message:
        "Error: Have to include the current ban status when muting a user",
    });
  }

  // If the channel has been created grab the channel object
  const channelInstance = await chat.getChannel(channelID);
  const userInstance = await chat.getUser(userID);

  if (channelInstance == null || userInstance == null) {
    return res.status(500).send({
      message: `Error: No channel instance matches the ID: ${channelID} or No user Instance matches the ID: ${userID}`,
    });
  }

  await channelInstance.setRestrictions(userInstance, {
    ban: ban,
    mute: mute,
    reason: "Restricted by admin",
  });

  return res.status(200);
};
```

## Delete Message Request (moderation.js)

This function allows for you to `soft` delete a message. This means the message can be restored later on. Setting `soft` to false will permately delete the message.

```js
const deleteMessage = async (req, res) => {
  // Get PubNub Admin UUID
  const chat = await Chat.init(config_file);

  const messageID = req.body.messageID;
  const channelID = req.body.channelID;

  // If the channel has been created grab the channel object
  const channelInstance = await chat.getChannel(channelID);

  if (channelInstance == null) {
    return res.status(500).send({
      message: `Error: No channel instance matches the ID: ${channelID}`,
    });
  }

  const message = await channelInstance.getMessage(messageID);

  // Soft delete a message so it is able to be restored
  await message.delete({
    soft: true,
  });

  return res.status(200);
};
```

## Restore Message (moderation.js)

This funciton resotres a message that has been previously deleted from a channel.

```js
const restoreMessage = async (req, res) => {
  // Get PubNub Admin UUID
  const chat = await Chat.init(config_file);

  const messageID = req.body.messageID;
  const channelID = req.body.channelID;

  // If the channel has been created grab the channel object
  const channelInstance = await chat.getChannel(channelID);

  if (channelInstance == null) {
    return res.status(500).send({
      message: `Error: No channel instance matches the ID: ${channelID}`,
    });
  }

  const message = await channelInstance.getMessage(messageID);

  await message.restore();

  return res.status(200);
};
```
