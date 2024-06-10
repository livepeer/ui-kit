"use client";

import { type Channel, Chat, type User } from "@pubnub/chat";
import { usePathname } from "next/navigation";
import React, { type ReactNode, useEffect, useState, useCallback } from "react";

export interface ChatType {
  chatInstance: Chat | undefined;
  userInstance: User | undefined;
  channelInstance: Channel | undefined;
  createPubnubUser: (username: string) => Promise<void>;
  createPubnubChannel: (id: string) => Promise<void>;
}

export const ChatContext = React.createContext<ChatType | null>(null);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [chatInstance, setChatInstance] = useState<Chat>();
  const [userInstance, setUserInstance] = useState<User>();
  const [channelInstance, setChannelInstance] = useState<Channel>();

  /// Initializes the PubNub Chat Component
  /// The secret key is used to add admin functionality such as muting and banning a user from a channel
  /// ATTENTION: Muting / banning shoulbe be done entirely server-side it is done on the client in this case to simplify things
  const initChat = useCallback(async () => {
    // Set the userId to admin if the URL path is "/" else you are a viewer and should have a random userId
    const userId =
      pathname === "/"
        ? "admin"
        : `user_${Math.floor(Math.random() * 1000)}_${Date.now()}`;

    try {
      // Intialize the PubNub instance
      const pubNub = await Chat.init({
        publishKey: process.env.NEXT_PUBLIC_PUBLISH_KEY,
        subscribeKey: process.env.NEXT_PUBLIC_SUBSCRIBE_KEY,
        userId: userId, // Ensure this is correctly obtained or set
      });
      setChatInstance(pubNub);
    } catch (error) {
      console.error("Failed to initialize PubNub:", error);
    }
  }, [pathname]);

  // Initialize the PubNub instance
  useEffect(() => {
    if (!chatInstance) {
      initChat();
    }
  }, [chatInstance, initChat]);

  /// Creates a PubNub user and stores inside App Context
  /// A User needs to be created so we have the ability to ban, mute, and report messages and users
  const createPubnubUser = async (username: string) => {
    if (chatInstance === undefined) {
      throw new Error("This function must be used within a PubNubProvider");
    }
    if (userInstance) return;

    // This uses PubNub App Context to create a PubNub user with a username
    // Other metadata can be added if needed in your application by following the format below
    //   {
    //     name?: string,
    //     externalId?: string,
    //     profileUrl?: string,
    //     email?: string,
    //     custom?: ObjectCustom,
    //     status?: string,
    //     type?: string
    // }
    const user = await chatInstance.currentUser.update({
      name: username,
    });
    setUserInstance(user);
  };

  /// Grab or create a PubNub channel to get the Channel Object
  const createPubnubChannel = async (id: string) => {
    if (chatInstance === undefined) {
      throw new Error("This function must be used within a PubNubProvider");
    }
    if (channelInstance) return;

    let channel: Channel | null;

    // If the channel has been created grab the channel object
    channel = await chatInstance.getChannel(id);

    if (channel == null) {
      // We want to create a public conversation to let users engage in open conversation with many people.
      // Unlike group chats, anyone can join public channels.
      channel = await chatInstance.createPublicConversation({
        channelId: id,
        channelData: {
          name: `Publib Conversation - ${id}`,
          description: "Public chat for stream viewers.",
        },
      });
    }

    setChannelInstance(channel);
  };

  return (
    <ChatContext.Provider
      value={{
        chatInstance,
        userInstance,
        channelInstance,
        createPubnubUser,
        createPubnubChannel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
