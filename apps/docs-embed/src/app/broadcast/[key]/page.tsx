import { notFound } from "next/navigation";
import Audio from "@/components/broadcast/audio";
import Camera from "@/components/broadcast/camera";
import Container from "@/components/broadcast/container";
import Controls from "@/components/broadcast/controls";
import Enabled from "@/components/broadcast/enabled";
import PlayerError from "@/components/broadcast/error";
import Fullscreen from "@/components/broadcast/fullscreen";
import GettingStarted from "@/components/broadcast/getting-started";
import Loading from "@/components/broadcast/loading";
import Pip from "@/components/broadcast/pip";
import Portal from "@/components/broadcast/portal";
import Root from "@/components/broadcast/root";
import Screenshare from "@/components/broadcast/screenshare";
import Source from "@/components/broadcast/source";
import Status from "@/components/broadcast/status";
import UseBroadcastContext from "@/components/broadcast/use-broadcast-context";
import Video from "@/components/broadcast/video";
import {
  type BroadcastComponentKey,
  CodeWithExampleServer,
  getBroadcastKeys,
} from "@/components/code/code-server";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getBroadcastKeys().map((key) => ({
    key,
  }));
}

export default ({
  params,
}: {
  params: { key: BroadcastComponentKey | undefined };
}) => {
  if (!params.key) {
    notFound();
  }

  return (
    <CodeWithExampleServer
      type="broadcast"
      example={
        params.key === "getting_started" ? (
          <GettingStarted />
        ) : params.key === "container" ? (
          <Container />
        ) : params.key === "enabled" ? (
          <Enabled />
        ) : params.key === "audio" ? (
          <Audio />
        ) : params.key === "source" ? (
          <Source />
        ) : params.key === "camera" ? (
          <Camera />
        ) : params.key === "screenshare" ? (
          <Screenshare />
        ) : params.key === "loading" ? (
          <Loading />
        ) : params.key === "portal" ? (
          <Portal />
        ) : params.key === "error" ? (
          <PlayerError />
        ) : params.key === "use_broadcast_context" ? (
          <UseBroadcastContext />
        ) : params.key === "fullscreen" ? (
          <Fullscreen />
        ) : params.key === "pip" ? (
          <Pip />
        ) : params.key === "status" ? (
          <Status />
        ) : params.key === "root" ? (
          <Root />
        ) : params.key === "controls" ? (
          <Controls />
        ) : params.key === "video" ? (
          <Video />
        ) : (
          // biome-ignore lint/complexity/noUselessFragments: ignored using `--suppress`
          <></>
        )
      }
      component={params.key}
    />
  );
};
