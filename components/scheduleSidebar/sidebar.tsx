"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { ModeToggle } from "@/components/modeToggle";
import { Calendar } from "@/components/ui/calendar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function ScheduleSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date | undefined>();

  const formatDateToLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      setDate(new Date(dateParam + "T00:00:00"));
    } else {
      const today = new Date();
      const todayStr = formatDateToLocal(today);
      router.replace(`/schedule?date=${todayStr}`);
      setDate(today);
    }
  }, [searchParams, router]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      const dateStr = formatDateToLocal(selectedDate);
      router.push(`/schedule?date=${dateStr}`);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <ModeToggle />
      </SidebarHeader>
      <SidebarContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="w-full"
        />
      </SidebarContent>
    </Sidebar>
  );
}
