import { Toaster } from "sonner";
import "./globals.css";

import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster theme="dark" />
    </>
  );
}
