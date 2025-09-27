"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div>
        <Alert variant="default" className="w-full max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            Something went wrong. Please try again.
            <div className="flex justify-end w-full">
              <Button size="sm" asChild>
                <Link href="/dashboard">Back to Top</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
