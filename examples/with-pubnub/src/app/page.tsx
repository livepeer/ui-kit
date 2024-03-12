import { Chat } from "@/components/chat/Chat";
import { ArrowUpRight } from "lucide-react";
import { cookies, headers } from "next/headers";
import { BroadcastWithControls } from "../components/broadcast/Broadcast";
import { CreateLivestreamButton } from "./create-livestream-button";

export default async function Home() {
  const streamKey = cookies().get("stream-key")?.value;
  const playbackId = cookies().get("playback-id")?.value;

  const host = headers().get("host");

  const playbackUrl =
    host && playbackId
      ? `${
          host.includes("localhost") ? "http" : "https"
        }://${host}/view/${playbackId}`
      : null;

  return (
    <main className="grid grid-cols-8 h-full relative min-h-screen bg-black">
      {!streamKey || !playbackId || !playbackUrl ? (
        <div className="flex flex-col flex-1 justify-center items-end gap-3 col-span-8">
          <h1 className="justify-center text-right flex text-3xl font-medium mr-3">
            Go live to an audience in seconds
          </h1>
          <span className="w-full h-px bg-gradient-to-l from-white/80 to-white/5 to-80% -mx-10" />
          <CreateLivestreamButton className="mr-3" />
        </div>
      ) : (
        <>
          <div
            className={
              "flex flex-col col-span-8 md:col-span-6 items-center gap-8 py-12 md:py-8 p-4"
            }
          >
            <div>
              <div className="flex gap-2 max-w-lg text-center flex-col">
                <span className="text-2xl font-semibold">
                  {"PubNub <> Livepeer"}
                </span>
                <span className="text-sm text-white/90">
                  Welcome to your viewer chat experience, using PubNub and
                  Livepeer to deliver real-time streaming and interactivity with
                  only a few lines of code.
                </span>
              </div>

              <span className="h-px w-full max-w-md bg-gradient-to-r from-white/5 via-white/60 to-white/5" />
            </div>

            <div className="w-full max-w-2xl gap-2 flex flex-col items-center mx-auto transition animate-in fade-in-0 duration-1000">
              <BroadcastWithControls streamKey={streamKey} />
              <a
                className="flex items-center gap-1 hover:underline"
                target="_blank"
                rel="noreferrer"
                href={playbackUrl}
              >
                Open viewer URL <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="col-span-8 md:col-span-2 h-full">
            <Chat playbackId={playbackId} />
          </div>
        </>
      )}
    </main>
  );
}
