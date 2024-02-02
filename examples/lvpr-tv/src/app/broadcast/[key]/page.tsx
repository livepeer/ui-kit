import { BroadcastWithControls } from "@/components/broadcast/Broadcast";

export default async function BroadcastPage({
  params,
}: { params: { key?: string } }) {
  return (
    <main className="absolute inset-0 gap-2 flex flex-col justify-center items-center bg-black">
      <BroadcastWithControls streamKey={params?.key ?? null} />
    </main>
  );
}
