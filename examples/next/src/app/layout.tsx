import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livepeer w/ App Router",
  description: "Livepeer Kit with the Next.JS App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "dark-theme text-white bg-black min-h-screen-safe pb-[env(safe-area-inset-bottom)]",
        )}
      >
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
