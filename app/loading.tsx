import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] p-4">
      <Loader2Icon className="animate-spin size-8 text-primary" />
    </div>
  );
}
