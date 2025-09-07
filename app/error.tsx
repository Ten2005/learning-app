"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div>
        <Alert variant="default" className="w-full max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again.
          </AlertDescription>
        </Alert>
        <LinkAsButton />
      </div>
    </div>
  );
}

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LinkAsButton() {
  return (
    <Button asChild variant={"link"}>
      <Link href="/">Top Page</Link>
    </Button>
  );
}
