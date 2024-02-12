import { BroadcastWithControls } from "@/components/broadcast/Broadcast";
import { getIngest } from "@livepeer/react/external";

export default async function BroadcastPage({
  params,
}: { params: { key?: string } }) {
  const ingestUrl = getIngest(params.key);

  return (
    <main className="absolute inset-0 gap-2 flex flex-col justify-center items-center bg-black">
      <BroadcastWithControls ingestUrl={ingestUrl} />
    </main>
  );
}
