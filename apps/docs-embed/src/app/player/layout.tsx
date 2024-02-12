import React from "react";

export default async function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="relative w-full h-full">{children}</div>;
}
