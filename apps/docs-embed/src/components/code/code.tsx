"use client";

import { cn } from "@/lib/utils";
import "./shiki.css";

export const ExpandableCode = ({ code }: { code: string }) => {
  return (
    <div
      className={cn("flex flex-col relative overflow-hidden")}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: code,
      }}
    />
  );
};
