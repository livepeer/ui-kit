import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PlayerLoading, PlayerWithControls } from "./Player";

export default async function PlayerPage({
  params,
}: { params: { type: "asset-short" | "asset-long" | "livestream" | "jwt" } }) {
  const data =
    params.type === "asset-long"
      ? ({
          type: params.type,
          title: "The video below is a long-form static asset.",
          playbackId: "be1e4f7z0yfw88wd",
        } as const)
      : params.type === "asset-short"
        ? ({
            type: params.type,
            title: "The video below is a short-form static asset.",
            playbackId: "cbddoks280eyu0x7",
          } as const)
        : params.type === "jwt"
          ? ({
              type: params.type,
              title: "The video below is a JWT-protected static asset.",
              playbackId: "c494mgnniubh601y",
            } as const)
          : params.type === "livestream"
            ? ({
                type: params.type,
                title: (
                  <>
                    The video below is a live stream from{" "}
                    <a
                      className="font-medium hover:text-white/70 text-white/80"
                      target="_blank"
                      rel="noreferrer"
                      href="https://www.thelotradio.com/"
                    >
                      The Lot Radio (check them out!)
                    </a>
                    .
                  </>
                ),
                playbackId: "85c28sa2o8wppm58",
              } as const)
            : ({
                type: "unknown",
                title:
                  "The video below is from the playback ID passed in the URL.",
                playbackId: params.type,
              } as const);

  return (
    <main className="flex relative min-h-screen flex-col items-center bg-black gap-8 py-12 md:py-8 p-4">
      <Link
        className="absolute flex gap-2 items-center font-medium hover:text-white/70 text-white/80 text-sm top-4 left-6"
        href="/"
      >
        <ArrowLeft className="w-4 h-4" /> Go back
      </Link>
      <div className="flex gap-2 max-w-lg text-center flex-col">
        <span className="text-2xl font-semibold">Livepeer UI Kit Player</span>
        <span className="text-sm text-white/90">
          The Player below demonstrates how to compose a Player with the
          standard controls found on most players. The playback information is
          fetched from the server, so latency is reduced and the API key is kept
          private.
        </span>

        <span className="text-sm text-white/90">{data.title}</span>
      </div>

      <span className="h-px w-full max-w-md bg-gradient-to-r from-white/5 via-white/60 to-white/5" />

      <Suspense fallback={<PlayerLoading />}>
        <PlayerWithControls type={data.type} playbackId={data.playbackId} />
      </Suspense>
    </main>
  );
}

export async function generateStaticParams() {
  return [
    {
      type: "asset",
    },
    {
      type: "livestream",
    },
  ];
}
