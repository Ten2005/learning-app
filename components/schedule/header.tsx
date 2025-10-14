"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ScheduleHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentDate = searchParams.get("date");

  const formatDateToLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (direction: "prev" | "next") => {
    if (!currentDate) return;

    const date = new Date(currentDate + "T00:00:00");
    if (direction === "prev") {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }

    const newDateStr = formatDateToLocal(date);
    router.push(`/schedule?date=${newDateStr}`);
  };

  return (
    <div className="flex flex-col justify-between py-1 px-2 sticky top-10 bg-background z-5">
      <div className="flex flex-row justify-between pb-1">
        <div className="flex flex-row items-center max-w-full truncate overflow-x-auto scrollbar-hide">
          <Label className="text-primary">{currentDate || "Loading..."}</Label>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => handleDateChange("prev")}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => handleDateChange("next")}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
