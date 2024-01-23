import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen justify-center items-center bg-black gap-12 p-10">
      <Link
        className="justify-end items-center flex-1 text-center flex text-3xl font-medium hover:text-white/90"
        href="/player"
      >
        Player
      </Link>
      <span className="h-52 w-px rotate-[35deg] bg-gradient-to-b from-white/5 via-white/60 to-white/5" />
      <Link
        className="flex-1 flex items-center text-center text-3xl font-medium hover:text-white/90"
        href="/broadcast"
      >
        Broadcast
      </Link>
    </main>
  );
}
