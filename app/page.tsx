"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import { PRODUCT_NAME, PRODUCT_DESCRIPTION } from "@/constants";

export default function Home() {
  return (
    <main className="min-h-[100dvh] flex items-center px-4 py-8">
      <section className="flex flex-col gap-6 max-w-screen-md w-full mx-auto">
        <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger>
            <h1 className="text-2xl font-bold leading-tight">
              <span className="text-primary">{PRODUCT_NAME}</span> AI-Integrated
              Editor for Knowledge Workers
            </h1>
          </HoverCardTrigger>
          <HoverCardContent side="top">{PRODUCT_DESCRIPTION}</HoverCardContent>
        </HoverCard>
        <div className="flex flex-col gap-2">
          <p className="text-base text-muted-foreground">
            Write, think, and collaborate with AI — all in one place.
          </p>
          <p className="text-sm text-muted-foreground">
            PWA-ready — Install to your Home Screen.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/search">Search</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
