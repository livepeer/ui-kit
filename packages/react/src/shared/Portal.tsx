"use client";

// biome-ignore lint/style/useImportType: necessary import
import React from "react";

import * as RadixPortal from "@radix-ui/react-portal";

const PORTAL_NAME = "Portal";

type PortalProps = React.ComponentPropsWithoutRef<typeof RadixPortal.Root>;

const Portal: React.FC<PortalProps> = (props: PortalProps) => {
  return <RadixPortal.Root {...props} />;
};

Portal.displayName = PORTAL_NAME;

export { Portal, type PortalProps };
