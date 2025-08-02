"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboard";
import { ChevronRightIcon, ChevronLeftIcon, TelescopeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { currentContent, setCurrentContent, currentTitle } =
    useDashboardStore();

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex flex-col gap-2 justify-between border-b p-2">
        <div className="flex flex-row justify-between">
          <Label htmlFor="message-2" className="text-primary">
            {currentTitle ? currentTitle : "None"}
          </Label>
          <PageButtons />
        </div>
        <Button variant="outline" size="icon" className="size-6">
          <TelescopeIcon />
        </Button>
      </div>
      <Textarea
        value={currentContent}
        onChange={(e) => setCurrentContent(e.target.value)}
        className="
        w-full flex-1
        resize-none border-none focus:border-none focus-visible:ring-0"
      />
    </div>
  );
}

function PageButtons() {
  return (
    <div className="flex flex-row gap-2">
      <Button size="icon" variant="ghost" className="size-6">
        <ChevronLeftIcon />
      </Button>
      <Button size="icon" variant="ghost" className="size-6">
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
