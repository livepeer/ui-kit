import {
  type Channel,
  type Message,
  Chat as PubNubChat,
  User,
} from "@pubnub/chat";

import { cache } from "react";

const initializePubNubServerSide = cache(
  async (userId: string): Promise<PubNubChat> => {
    if (
      !process.env.NEXT_PUBLIC_PUBLISH_KEY ||
      !process.env.NEXT_PUBLIC_SUBSCRIBE_KEY ||
      !process.env.NEXT_PUBLIC_SECRET_KEY
    ) {
      throw new Error(
        "Missing one or more environment variables for PubNub initialization",
      );
    }

    return PubNubChat.init({
      publishKey: process.env.NEXT_PUBLIC_PUBLISH_KEY,
      subscribeKey: process.env.NEXT_PUBLIC_SUBSCRIBE_KEY,
      userId,
      secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
    });
  },
);

// Initiate PubNub
export const initPubNub = async (userId: string) => {
  try {
    return await initializePubNubServerSide(userId);
  } catch (error) {
    console.log("Error Initiaiting PubNub Instance ", error);
  }
};
