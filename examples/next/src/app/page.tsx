import * as Player from "@livepeer/react/player";
import * as Assets from "@livepeer/react/assets";
import { parsePlaybackInfo } from "@livepeer/react";

import { Livepeer } from "livepeer";
import PlayButton from "./components/PlayButton";
import FullscreenButton from "./components/FullscreenButton";

const livepeer = new Livepeer({
  apiKey: "",
});

export default async function Home() {
  const playbackInfo = await livepeer.playback.get("7a62sll7tf2qs9q2");

  const src = parsePlaybackInfo(playbackInfo.playbackInfo);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-10">
      <span className="text-2xl font-semibold">Livepeer React Player</span>
      <div className="w-full max-w-2xl mx-auto">
        {src && (
          <Player.Root
            autoPlay
            className="w-full h-full overflow-hidden rounded-sm bg-black"
            src={src}
          >
            <Player.Video muted className="w-full h-full" />

            <Player.Controls className="bg-gradient-to-b gap-1 px-3 md:px-3 py-1.5 flex-col-reverse flex from-transparent via-80% via-black/30 to-black/60 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=true]:fade-out-0 data-[visible=false]:fade-in-0">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <PlayButton />
                  <Player.LiveIndicator className="flex gap-2 items-center">
                    <span className="bg-red-600 h-1.5 w-1.5 rounded-full" />
                    <span className="text-sm select-none">LIVE</span>
                  </Player.LiveIndicator>
                  <Player.Time className="text-sm select-none" />
                </div>
                <div className="flex items-center gap-2">
                  <Player.PictureInPictureTrigger className="w-6 h-6 md:w-7 md:h-7">
                    <Assets.PictureInPictureIcon className="w-full h-full" />
                  </Player.PictureInPictureTrigger>
                  <FullscreenButton />
                </div>
              </div>
              <Player.Seek className="relative flex cursor-pointer items-center select-none touch-none w-full h-5">
                <Player.SeekTrack className="bg-white/30 relative grow rounded-full h-[2px] md:h-[3px]">
                  <Player.SeekRange className="absolute bg-white rounded-full h-full" />
                </Player.SeekTrack>
                <Player.SeekThumb className="block w-3 h-3 md:w-4 md:h-4 bg-white rounded-full" />
              </Player.Seek>
            </Player.Controls>
          </Player.Root>
        )}
      </div>
    </main>
  );
}
