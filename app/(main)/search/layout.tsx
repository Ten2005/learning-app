import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SearchSidebar } from "@/components/searchSidebar/sidebar";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
