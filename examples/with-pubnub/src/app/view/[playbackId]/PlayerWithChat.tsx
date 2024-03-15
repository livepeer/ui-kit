import type { Src } from "@livepeer/react";
import { PlayerWithControls } from "../../../components/player/Player";

export default function PlayerWithChat({ src }: { src: Src[] }) {
  return <PlayerWithControls src={src} />;
}
