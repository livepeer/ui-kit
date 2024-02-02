import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex flex-col md:flex-row min-h-screen justify-center items-center bg-black gap-12 p-10">
      <div className="-translate-y-10 flex flex-col flex-1 justify-end md:items-end gap-3">
        <h1 className="md:flex-1 justify-center flex text-3xl font-medium">
          Player
        </h1>
        <div className="flex flex-col">
          <Link
            className="items-center justify-center md:justify-end gap-2 flex-1 flex text-lg hover:text-white/80 text-white/90"
            href="/player/livestream"
          >
            <span>Play a livestream</span> <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            className="items-center justify-center md:justify-end gap-2 flex-1 flex text-lg hover:text-white/80 text-white/90"
            href="/player/asset-short"
          >
            <span>Play a short video</span>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            className="items-center justify-center md:justify-end gap-2 flex-1 flex text-lg hover:text-white/80 text-white/90"
            href="/player/asset-long"
          >
            <span>Play a long video</span>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <span className="w-full h-px md:h-[600px] md:w-px -rotate-[30deg] md:rotate-[35deg] bg-gradient-to-r md:bg-gradient-to-b from-transparent via-white/80 to-transparent" />
      <div className="translate-y-10 flex flex-col flex-1 items-start gap-3">
        <h1 className="md:flex-1 flex text-3xl font-medium">Broadcast</h1>
        <Link
          className="items-center gap-2 md:flex-1 flex text-lg hover:text-white/80 text-white/90"
          href="/broadcast"
        >
          <span>Broadcast now</span> <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    </main>
  );
}
