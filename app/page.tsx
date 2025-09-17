"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PRODUCT_NAME } from "@/constants";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <section className="text-center flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold">Accelerate your work life.</h1>
        <div className="flex flex-col items-center justify-center gap-4 w-fit">
          <Badge
            variant="outline"
            className="flex flex-col items-center gap-1 p-3 text-sm"
          >
            <span className="text-foreground font-medium">{PRODUCT_NAME}</span>
            <span className="text-muted-foreground text-xs">
              PWA-ready — Install to your Home Screen.
            </span>
          </Badge>
          <Button size="sm" className="w-full max-w-full" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
