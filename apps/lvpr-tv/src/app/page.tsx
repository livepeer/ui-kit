import type { ClipLength } from "@livepeer/react";
import { Suspense } from "react";
import {
  PlayerLoading,
  type PlayerProps,
  PlayerWithControls,
  PlayerWithoutControls,
} from "@/components/player/Player";
import type { Booleanish } from "@/lib/types";
import { coerceToBoolean } from "@/lib/utils";
import { IframeMessenger } from "../components/IframeMessenger";

type Autoplay = Booleanish;
type Muted = Booleanish;
type Loop = Booleanish;
type LowLatency = Booleanish | "force";
type ObjectFit = "contain" | "cover";
type Constant = Booleanish;
type Debug = Booleanish;
type IngestPlayback = Booleanish;
type Controls = Booleanish;

type PlayerSearchParams = {
  v?: string;
  playbackId?: string;
  url?: string;
  autoplay?: Autoplay;
  muted?: Muted;
  loop?: Loop;
  lowLatency?: LowLatency;
  backoffMax?: number;
  objectFit?: ObjectFit;
  constant?: Constant;
  clipLength?: ClipLength;
  jwt?: string;
  accessKey?: string;
  debug?: Debug;
  ingestPlayback?: IngestPlayback;
  controls?: Controls;
};

export default async function PlayerPage({
  searchParams,
}: {
  searchParams: Partial<PlayerSearchParams>;
}) {
  const autoplay = coerceToBoolean(searchParams?.autoplay, true);

  const props: PlayerProps = {
    type: "iframe",
    url: searchParams?.url ?? null,
    playbackId: searchParams?.v ?? searchParams?.playbackId ?? null,
    autoplay: coerceToBoolean(searchParams?.autoplay, true),
    muted: coerceToBoolean(searchParams?.muted, autoplay),
    constant: coerceToBoolean(searchParams?.constant, false),
    loop: coerceToBoolean(searchParams?.loop, false),
    lowLatency:
      searchParams?.lowLatency === "force"
        ? "force"
        : coerceToBoolean(searchParams?.lowLatency, true),
    backoffMax: searchParams?.backoffMax ?? null,
    objectFit: searchParams?.objectFit ?? "contain",
    clipLength: searchParams?.clipLength
      ? (Number(searchParams.clipLength) as ClipLength)
      : null,
    jwt: searchParams?.jwt ?? null,
    accessKey: searchParams?.accessKey ?? null,
    debug: coerceToBoolean(searchParams?.debug, false),
    ingestPlayback: coerceToBoolean(searchParams?.ingestPlayback, false),
    controls: coerceToBoolean(searchParams?.controls, true),
  };

  const showControls = coerceToBoolean(searchParams?.controls, true);

  return (
    <>
      <IframeMessenger />
      <main className="absolute flex flex-col justify-center items-center h-full w-full inset-0 bg-black">
        <Suspense fallback={<PlayerLoading />}>
          {showControls ? (
            <PlayerWithControls {...props} />
          ) : (
            <PlayerWithoutControls {...props} />
          )}
        </Suspense>
      </main>
    </>
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
