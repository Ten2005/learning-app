import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SearchSidebar } from "@/components/searchSidebar/sidebar";
import Navigation from "@/components/navigation";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchSidebar />
      <main className="w-full">
        <div className="flex flex-row items-center justify-between px-4 py-2 border-b">
          <SidebarTrigger />
          <Navigation />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
