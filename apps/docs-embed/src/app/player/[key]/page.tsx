import { notFound } from "next/navigation";
import {
  CodeWithExampleServer,
  getPlayerKeys,
  type PlayerComponentKey,
} from "@/components/code/code-server";
import Clip from "@/components/player/clip";
import Container from "@/components/player/container";
import Controls from "@/components/player/controls";
import PlayerError from "@/components/player/error";
import Fullscreen from "@/components/player/fullscreen";
import GettingStarted from "@/components/player/getting-started";
import Live from "@/components/player/live";
import Loading from "@/components/player/loading";
import Pip from "@/components/player/pip";
import Play from "@/components/player/play";
import Portal from "@/components/player/portal";
import Poster from "@/components/player/poster";
import Rate from "@/components/player/rate";
import Root from "@/components/player/root";
import Seek from "@/components/player/seek";
import Time from "@/components/player/time";
import UseMediaContext from "@/components/player/use-media-context";
import Video from "@/components/player/video";
import VideoQuality from "@/components/player/video-quality";
import Volume from "@/components/player/volume";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getPlayerKeys().map((key) => ({
    key,
  }));
}

export default ({
  params,
}: {
  params: { key: PlayerComponentKey | undefined };
}) => {
  if (!params.key) {
    notFound();
  }

  return (
    <CodeWithExampleServer
      type="player"
      example={
        params.key === "getting_started" ? (
          <GettingStarted />
        ) : params.key === "clip" ? (
          <Clip />
        ) : params.key === "container" ? (
          <Container />
        ) : params.key === "loading" ? (
          <Loading />
        ) : params.key === "portal" ? (
          <Portal />
        ) : params.key === "error" ? (
          <PlayerError />
        ) : params.key === "time" ? (
          <Time />
        ) : params.key === "fullscreen" ? (
          <Fullscreen />
        ) : params.key === "pip" ? (
          <Pip />
        ) : params.key === "root" ? (
          <Root />
        ) : params.key === "controls" ? (
          <Controls />
        ) : params.key === "live" ? (
          <Live />
        ) : params.key === "play" ? (
          <Play />
        ) : params.key === "poster" ? (
          <Poster />
        ) : params.key === "use_media_context" ? (
          <UseMediaContext />
        ) : params.key === "rate" ? (
          <Rate />
        ) : params.key === "seek" ? (
          <Seek />
        ) : params.key === "video" ? (
          <Video />
        ) : params.key === "video_quality" ? (
          <VideoQuality />
        ) : params.key === "volume" ? (
          <Volume />
        ) : (
          // biome-ignore lint/complexity/noUselessFragments: ignored using `--suppress`
          <></>
        )
      }
      component={params.key}
    />
  );
};
