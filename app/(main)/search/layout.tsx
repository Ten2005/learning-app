import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SearchSidebar } from "@/components/searchSidebar/sidebar";
import Navigation from "@/components/navigation";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchSidebar />
      <main className="w-full">
        <div className="flex flex-row items-center justify-between px-2 py-1 h-10 border-b sticky top-0 bg-background z-10">
          <SidebarTrigger />
          <Navigation />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
