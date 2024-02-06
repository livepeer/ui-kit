import Link from "next/link";
import { BroadcastWithControls } from "./Broadcast";

export default async function Home() {
  return (
    <main className="flex relative min-h-screen flex-col items-center bg-black gap-8 py-12 md:py-8 p-4">
      <Link
        className="absolute font-medium hover:text-white/70 text-white/80 text-sm top-4 left-6"
        href="/"
      >
        Go back
      </Link>
      <div className="flex gap-2 max-w-lg text-center flex-col">
        <span className="text-2xl font-semibold">Livepeer Kit Broadcast</span>
        <span className="text-sm text-white/90">
          The component below demonstrates how to compose a Broadcast with the
          standard controls found on most broadcast interfaces.
        </span>
      </div>

      <span className="h-px w-full max-w-md bg-gradient-to-r from-white/5 via-white/60 to-white/5" />

      <BroadcastWithControls />
    </main>
  );
}
