import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] p-4">
      <Spinner className="text-primary" />
    </div>
  );
}
