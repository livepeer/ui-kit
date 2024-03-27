import { Chat } from "@/components/chat/Chat";
import { ChatContextProvider } from "@/components/chat/context/ChatContext";
import type { ReactNode } from "react";

export default function PlayerLayout({
  children,
  params,
}: { children: ReactNode; params: { playbackId: string } }) {
  return (
    <main className="grid grid-cols-8 relative min-h-screen bg-black h-full">
      <div className="col-span-6 flex flex-col items-center gap-8 py-12 md:py-8 p-4">
        <div className="flex gap-2 max-w-lg text-center flex-col">
          <span className="text-2xl font-semibold">{"PubNub <> Livepeer"}</span>
          <span className="text-sm text-white/90">
            Welcome to your viewer chat experience, using PubNub and Livepeer to
            deliver real-time streaming and interactivity with only a few lines
            of code.
          </span>
        </div>

        <span className="h-px w-full max-w-md bg-gradient-to-r from-white/5 via-white/60 to-white/5" />

        {children}
      </div>
      <div className="col-span-8 md:col-span-2 h-full">
        <ChatContextProvider>
          <Chat playbackId={params.playbackId} />
        </ChatContextProvider>
      </div>
    </main>
  );
}
