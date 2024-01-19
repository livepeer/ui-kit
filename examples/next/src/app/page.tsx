import { Suspense } from "react";
import { PlayerServer, PlayerLoading } from "./PlayerServer";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black gap-8 p-10">
      <span className="text-2xl font-semibold">Livepeer React Player</span>
      <Suspense fallback={<PlayerLoading />}>
        <PlayerServer />
      </Suspense>
    </main>
  );
}
