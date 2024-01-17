"use client";

import { getCssText } from "@livepeer/react";
import { useServerInsertedHTML } from "next/navigation";
import React from "react";

export const StitchesRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useServerInsertedHTML(() => {
    return (
      <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
    );
  });

  return <>{children}</>;
};
