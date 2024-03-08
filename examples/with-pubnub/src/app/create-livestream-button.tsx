"use client";

import { cn } from "@/lib/utils";
import { Videotape } from "lucide-react";
import { toast } from "sonner";
import { createLivestream } from "./actions";

export function CreateLivestreamButton({ className }: { className?: string }) {
  return (
    <form
      action={async () => {
        const result = await createLivestream();

        if (!result.success) {
          toast.error(result.error);
        } else {
          toast("Livestream created!");
        }
      }}
      className={cn("flex flex-col", className)}
    >
      <button
        type="submit"
        className="items-center rounded-md px-3 py-1 outline outline-1 outline-white/30 hover:outline-white/40 justify-center md:justify-end gap-2 flex-1 flex text-lg text-white/90 transition-opacity"
      >
        <span>Create a livestream</span>
        <Videotape strokeWidth={1} className="w-5 h-5" />
      </button>
    </form>
  );
}
