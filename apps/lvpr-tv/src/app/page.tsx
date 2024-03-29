import {
  PlayerLoading,
  type PlayerProps,
  PlayerWithControls,
} from "@/components/player/Player";
import type { Booleanish } from "@/lib/types";
import { coerceToBoolean } from "@/lib/utils";
import type { ClipLength } from "@livepeer/react";
import { Suspense } from "react";

type Autoplay = Booleanish;
type Muted = Booleanish;
type Loop = Booleanish;
type LowLatency = Booleanish | "force";
type ObjectFit = "contain" | "cover";
type Constant = Booleanish;
type Debug = Booleanish;

type PlayerSearchParams = {
  v?: string;
  playbackId?: string;
  url?: string;
  autoplay?: Autoplay;
  muted?: Muted;
  loop?: Loop;
  lowLatency?: LowLatency;
  objectFit?: ObjectFit;
  constant?: Constant;
  clipLength?: ClipLength;
  jwt?: string;
  debug?: Debug;
  "cta-button-text"?: string;
  "cta-button-color"?: string;
  "cta-button-link"?: string;
};

export default async function PlayerPage({
  searchParams,
}: {
  searchParams: Partial<PlayerSearchParams>;
}) {
  const autoplay = coerceToBoolean(searchParams?.autoplay, true);

  const ctaButtonText = searchParams?.["cta-button-text"];
  const ctaButtonColor = searchParams?.["cta-button-color"];
  const ctaButtonLink = searchParams?.["cta-button-link"];

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
    objectFit: searchParams?.objectFit ?? "contain",
    clipLength: searchParams?.clipLength
      ? (Number(searchParams.clipLength) as ClipLength)
      : null,
    jwt: searchParams?.jwt ?? null,
    debug: coerceToBoolean(searchParams?.debug, false),

    ctaButtonText,
    ctaButtonColor,
    ctaButtonLink,
  };

  console.log(ctaButtonColor);
  return (
    <main className="absolute flex flex-col justify-center items-center h-full w-full inset-0 bg-black">
      <Suspense fallback={<PlayerLoading />}>
        <PlayerWithControls {...props} />
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
