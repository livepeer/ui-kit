import { getIngest } from "@livepeer/react/external";
import { BroadcastWithControls } from "@/components/broadcast/Broadcast";
import type { Booleanish } from "@/lib/types";
import { coerceToBoolean } from "@/lib/utils";

type BroadcastSearchParams = {
  forceEnabled?: Booleanish;
  hideEnabled?: Booleanish;
  idealWidth?: string | number;
  idealHeight?: string | number;
};

export default async function BroadcastPage({
  params,
  searchParams,
}: {
  params: { key?: string };
  searchParams: Partial<BroadcastSearchParams>;
}) {
  const ingestUrl = getIngest(params.key, {
    baseUrl:
      process.env.NEXT_PUBLIC_WEBRTC_INGEST_BASE_URL ??
      "https://playback.livepeer.studio/webrtc",
  });

  return (
    <main className="absolute inset-0 gap-2 flex flex-col justify-center items-center bg-black">
      <BroadcastWithControls
        ingestUrl={ingestUrl}
        forceEnabled={coerceToBoolean(searchParams?.forceEnabled, true)}
        hideEnabled={coerceToBoolean(searchParams?.hideEnabled, false)}
        video={
          searchParams.idealHeight || searchParams.idealWidth
            ? {
                width: searchParams.idealWidth
                  ? Number(searchParams.idealWidth)
                  : undefined,
                height: searchParams.idealHeight
                  ? Number(searchParams.idealHeight)
                  : undefined,
              }
            : undefined
        }
      />
    </main>
  );
}
