import * as components from "@/lib/components";
import { codeToHtml } from "@/lib/shiki";
import { notFound } from "next/navigation";
import { ExpandableCode } from "./code";

export type ComponentKey = keyof typeof components;

export const CodeWithExampleServer = async ({
  example,
  component,
}: { example: React.ReactNode; component: ComponentKey }) => {
  const stringComponent = components[component];

  if (!stringComponent) {
    notFound();
  }

  const result = await codeToHtml({
    code: components[component],
  });

  return (
    <div className="flex flex-col rounded-lg">
      <div className="relative flex w-full min-h-[300px] items-center justify-center overflow-hidden">
        {example}
      </div>
      <ExpandableCode code={result} />
    </div>
  );
};
