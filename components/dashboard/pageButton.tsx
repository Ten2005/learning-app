"use client";

import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function PageButtons() {
    return (
      <div className="flex flex-row gap-2">
        <Button size="icon" variant="ghost" className="size-8">
          <ChevronLeftIcon />
        </Button>
        <Button size="icon" variant="ghost" className="size-8">
          <ChevronRightIcon />
        </Button>
      </div>
    );
  }