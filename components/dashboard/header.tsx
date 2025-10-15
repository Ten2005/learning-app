import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboard";
import { useSidebarStore } from "@/store/sidebar";
import PageButtons from "@/components/dashboard/pageButton";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const { currentFolder } = useSidebarStore();

  return (
    <div className="flex flex-col justify-between py-1 px-2 sticky top-10 z-5">
      <div className="flex flex-row justify-between pb-1">
        <ShowTitle />
        {currentFolder && <PageButtons />}
      </div>
    </div>
  );
}

function ShowTitle() {
  const { currentFile } = useDashboardStore();
  const { currentFolder } = useSidebarStore();

  return (
    <div className="flex flex-row items-center max-w-full truncate overflow-x-auto scrollbar-hide">
      <span className="text-xs text-muted-foreground px-1">
        {currentFolder?.name} -&gt; {currentFile?.page} :
      </span>
      <Label
        className={cn(
          currentFile?.title ? "text-primary" : "text-muted-foreground",
        )}
      >
        {currentFile?.title ? currentFile.title : "None"}
      </Label>
    </div>
  );
}
