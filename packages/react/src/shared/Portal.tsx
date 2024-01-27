"use client";

import React from "react";

import * as RadixPortal from "@radix-ui/react-portal";

const PORTAL_NAME = "SelectPortal";

type RootPortalProps = React.ComponentPropsWithoutRef<typeof RadixPortal.Root>;
interface PortalProps {
  children?: React.ReactNode;
  /**
   * Specify a container element to portal the content into.
   */
  container?: RootPortalProps["container"];
}

const Portal: React.FC<PortalProps> = (props: PortalProps) => {
  return <RadixPortal.Root asChild {...props} />;
};

Portal.displayName = PORTAL_NAME;

export { Portal, type PortalProps };
