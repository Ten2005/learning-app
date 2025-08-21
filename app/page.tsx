import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PRODUCT_NAME } from "@/constants";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen gap-4 p-4">
      <h1 className="text-4xl font-bold">{PRODUCT_NAME}</h1>
      <Button size="sm" asChild>
        <Link href="/dashboard">Get Started</Link>
      </Button>
    </div>
  );
}
