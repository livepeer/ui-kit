import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="dark-theme text-white bg-black min-h-screen-safe pb-[env(safe-area-inset-bottom)]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
