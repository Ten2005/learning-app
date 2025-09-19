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
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <section className="text-center flex flex-col items-end justify-center gap-2">
        <div className="flex items-end justify-between gap-2">
          <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger className="leading-none flex items-end justify-between gap-2">
              <span className="text-foreground font-medium">
                {PRODUCT_NAME}:
              </span>
              <h1 className="text-2xl font-bold leading-none">
                Accelerate your work life.
              </h1>
            </HoverCardTrigger>
            <HoverCardContent side="top">
              {PRODUCT_DESCRIPTION}
            </HoverCardContent>
          </HoverCard>
        </div>
        <p className="text-muted-foreground">
          PWA-ready — Install to your Home Screen.
        </p>
        <Button variant={"link"} size="sm" asChild>
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </section>
    </main>
  );
}
