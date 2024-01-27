import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen justify-center items-center bg-black gap-12 p-10">
      <div className="-translate-y-10 flex flex-col flex-1 justify-end items-end gap-3">
        <h1 className="flex-1 flex text-3xl font-medium">Player</h1>
        <div className="flex flex-col">
          <Link
            className="items-center justify-end gap-2 flex-1 flex text-lg hover:text-white/80 text-white/90"
            href="/player/livestream"
          >
            <span>Play a livestream</span> <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            className="items-center justify-end gap-2 flex-1 flex text-lg hover:text-white/80 text-white/90"
            href="/player/asset-short"
          >
            <span>Play a short video</span>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            className="items-center justify-end gap-2 flex-1 flex text-lg hover:text-white/80 text-white/90"
            href="/player/asset-long"
          >
            <span>Play a long video</span>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <span className="h-[600px] w-px rotate-[35deg] bg-gradient-to-b from-transparent via-white/60 to-transparent" />
      <div className="translate-y-10 flex flex-col flex-1 items-start gap-3">
        <h1 className="flex-1 flex text-3xl font-medium">Broadcast</h1>
        <Link
          className="items-center gap-2 flex-1 flex text-lg hover:text-white/80 text-white/90"
          href="/broadcast"
        >
          <span>Broadcast now</span> <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </main>
  );
}
