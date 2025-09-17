import { Suspense } from "react";
import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SearchSidebar } from "@/components/searchSidebar/sidebar";
import { SearchSidebarSkeleton } from "@/components/searchSidebar/sidebar-skeleton";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={<SearchSidebarSkeleton />}>
        <SearchSidebar />
      </Suspense>
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
