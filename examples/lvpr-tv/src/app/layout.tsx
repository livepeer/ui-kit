import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livepeer TV",
  description: "Video hosted on Livepeer Studio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="w-full h-full m-0" lang="en">
      <body
        className={cn(
          inter.className,
          "dark-theme relative h-full w-full text-white bg-black m-0",
        )}
      >
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
