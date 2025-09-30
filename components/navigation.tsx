"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/search", label: "Search" },
  { href: "/schedule", label: "Schedule" },
];

export default function Navigation() {
  const pathname = usePathname();
  const memoizedLinks = useMemo(() => links, []);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {pathname.split("/").pop()}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {memoizedLinks.map((link) => (
              <NavigationLink
                key={link.href}
                href={link.href}
                label={link.label}
                pathname={pathname}
              />
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function NavigationLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  return (
    <NavigationMenuLink key={href} asChild>
      <Link href={href} className={cn(pathname === href && "font-bold")}>
        {label}
      </Link>
    </NavigationMenuLink>
  );
}
