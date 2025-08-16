"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboard";
import { TelescopeIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePageButton from "@/components/dashboard/createPageButton";
import PageButtons from "@/components/dashboard/pageButton";

export default function Dashboard() {
  const { currentContent, setCurrentContent, currentTitle } =
    useDashboardStore();

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex flex-col gap-2 justify-between border-b p-2">
        <div className="flex flex-row justify-between">
          <Label className="text-primary">
            {currentTitle ? currentTitle : "None"}
          </Label>
          <PageButtons />
        </div>
        <div className="flex flex-row items-end justify-between">
          <Button variant="outline" size="icon" className="size-8">
            <TelescopeIcon />
          </Button>
          <CreatePageButton />
        </div>
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