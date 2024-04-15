"use client";

import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";

type ChatMessage = {
  id: string;
  content: string;
  author: string;
};

const dummyMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hey everyone, glad to be here!",
    author: "Chase",
  },
  {
    id: "2",
    content: "Is the stream starting soon?",
    author: "Alex",
  },
  {
    id: "3",
    content: "Wow, that's an amazing setup!",
    author: "Jordan",
  },
  {
    id: "4",
    content: "Can't wait to see what's planned for today!",
    author: "Morgan",
  },
  {
    id: "5",
    content: "How can we support the stream?",
    author: "Casey",
  },
  {
    id: "6",
    content: "That last point was really insightful.",
    author: "Jamie",
  },
  {
    id: "7",
    content: "Haha, that was hilarious 😂",
    author: "Taylor",
  },
  {
    id: "8",
    content: "Can someone recap what I missed?",
    author: "Blake",
  },
  {
    id: "9",
    content: "Thanks for answering my question!",
    author: "Drew",
  },
  {
    id: "10",
    content: "Great stream, looking forward to the next one!",
    author: "Chris",
  },
];

export const Chat = ({ playbackId }: { playbackId: string }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    ...dummyMessages,
    ...dummyMessages,
  ]);

  // use the playback ID as a unique ID to set up the chat

  return (
    <div
      className={cn(
        "relative h-screen w-full flex flex-col px-3 py-4 mx-auto justify-between bg-white/10 rounded-sm",
        chatMessages.length === 0 && "animate-pulse",
      )}
    >
      <div className="h-full pb-16">
        <span className="text-sm font-semibold">Stream chat</span>
        <span className="my-2 h-px w-full bg-gradient-to-r from-white/20 via-white/40 to-white/20" />
        <div className="min-h-[300px] max-h-[450px] md:max-h-full flex-grow overflow-scroll my-2 space-y-2">
          {chatMessages.length === 0 ? (
            <>
              <div className="w-full h-10 animate-pulse bg-white/5 rounded-lg" />
              <div className="w-full h-10 animate-pulse bg-white/5 rounded-lg" />
              <div className="w-full h-10 animate-pulse bg-white/5 rounded-lg" />
              <div className="w-full h-10 animate-pulse bg-white/5 rounded-lg" />
            </>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                id={message.id}
                className="flex flex-col rounded-lg px-3 py-2 border border-white/20"
              >
                <span className="text-xs font-medium">{message.author}</span>
                <span className="text-sm">{message.content}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="absolute bottom-2 left-2 right-2">
        <label className="sr-only" htmlFor="message" />
        <form
          action={(formData) => {
            const message = formData.get("message");

            console.log(`sending: ${message}`);
          }}
          className="w-full relative"
        >
          <input
            name="message"
            className="flex h-9 pr-8 w-full rounded-md border border-white/30 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            type="text"
            disabled={chatMessages.length === 0}
          />
          <div className="absolute bottom-0 right-2 top-0 flex w-5 items-center justify-center">
            <button
              className="hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-white/40 rounded-full p-1 transition"
              type="submit"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
