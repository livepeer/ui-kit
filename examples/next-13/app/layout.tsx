import "./globals.css";

import { Inter } from "next/font/google";

import { Providers } from "./providers";
import { StitchesRegistry } from "./registry";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={inter.className}>
        <StitchesRegistry>
          <Providers>{children}</Providers>
        </StitchesRegistry>
      </body>
    </html>
  );
}
