import { notFound } from "next/navigation";
import * as broadcastComponents from "@/lib/broadcast-components";
import * as playerComponents from "@/lib/player-components";
import { codeToHtml } from "@/lib/shiki";
import { ExpandableCode } from "./code";

export type PlayerComponentKey = keyof typeof playerComponents;
export type BroadcastComponentKey = keyof typeof broadcastComponents;

export const getPlayerKeys = () => {
  const playerKeys = Object.keys(playerComponents) as PlayerComponentKey[];

  return playerKeys;
};

export const getBroadcastKeys = () => {
  const broadcastKeys = Object.keys(
    broadcastComponents,
  ) as BroadcastComponentKey[];

  return broadcastKeys;
};

export const CodeWithExampleServer = async ({
  example,
  type,
  component,
}: {
  example: React.ReactNode;
  type: "player" | "broadcast";
  component: PlayerComponentKey | BroadcastComponentKey;
}) => {
  const stringComponent =
    type === "player"
      ? // biome-ignore lint/performance/noDynamicNamespaceImportAccess: ignored using `--suppress`
        playerComponents[component as PlayerComponentKey]
      : // biome-ignore lint/performance/noDynamicNamespaceImportAccess: ignored using `--suppress`
        broadcastComponents[component as BroadcastComponentKey];

  if (!stringComponent) {
    notFound();
  }

  const result = await codeToHtml({
    code: stringComponent,
  });

  return (
    <div className="flex flex-col rounded-lg">
      <div className="relative flex flex-col w-full min-h-[300px] items-center justify-center overflow-hidden">
        {example}
      </div>
      <ExpandableCode code={result} />
    </div>
  );
};
