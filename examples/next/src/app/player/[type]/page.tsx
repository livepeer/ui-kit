import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PlayerLoading, PlayerWithControls } from "./Player";

export default async function PlayerPage({
  params,
}: { params: { type: "asset" | "livestream" } }) {
  return (
    <main className="flex relative min-h-screen flex-col items-center bg-black gap-8 py-12 md:py-8 p-4">
      <Link
        className="absolute font-medium hover:text-white/70 text-white/80 text-sm top-4 left-6"
        href="/"
      >
        Go back
      </Link>
      <div className="flex gap-2 max-w-lg text-center flex-col">
        <span className="text-2xl font-semibold">Livepeer React Player</span>
        <span className="text-sm text-white/90">
          The Player below demonstrates how to compose a Player with the
          standard controls found on most players. The playback information is
          fetched from the server, so latency is reduced and the API key is kept
          private.
        </span>

        <span className="text-sm text-white/90">
          {params.type === "asset"
            ? "The video below is a static asset."
            : "The video below is a live stream."}
        </span>

        <Link
          className="items-center justify-center gap-1 flex-1 flex text-sm hover:text-white/80 text-white/90"
          href={
            params.type === "asset" ? "/player/livestream" : "/player/asset"
          }
        >
          <span>
            Play a {params.type === "asset" ? "live stream" : "static asset"}
          </span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <span className="h-px w-full max-w-md bg-gradient-to-r from-white/5 via-white/60 to-white/5" />

      <Suspense fallback={<PlayerLoading />}>
        <PlayerWithControls type={params.type} />
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
