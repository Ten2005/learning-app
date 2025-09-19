"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  {
    name: "Default Dark",
    value: "default-dark",
  },
  {
    name: "Red Dark",
    value: "red-dark",
  },
  {
    name: "Rose Dark",
    value: "rose-dark",
  },
  {
    name: "Orange Dark",
    value: "orange-dark",
  },
  {
    name: "Green Dark",
    value: "green-dark",
  },
  {
    name: "Blue Dark",
    value: "blue-dark",
  },
  {
    name: "Yellow Dark",
    value: "yellow-dark",
  },
  {
    name: "Violet Dark",
    value: "violet-dark",
  },
  {
    name: "Default Light",
    value: "default-light",
  },
  {
    name: "Red Light",
    value: "red-light",
  },
  {
    name: "Rose Light",
    value: "rose-light",
  },
  {
    name: "Orange Light",
    value: "orange-light",
  },
  {
    name: "Green Light",
    value: "green-light",
  },
  {
    name: "Blue Light",
    value: "blue-light",
  },
  {
    name: "Yellow Light",
    value: "yellow-light",
  },
  {
    name: "Violet Light",
    value: "violet-light",
  },
];

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => {
              setTheme(theme.value);
              window.location.reload();
            }}
          >
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
