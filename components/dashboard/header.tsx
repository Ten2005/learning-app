import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboard";
import { useSidebarStore } from "@/store/sidebar";
import PageButtons from "@/components/dashboard/pageButton";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMMAND_MODEL_OPTIONS } from "@/constants/dashboard";

export function DashboardHeader() {
  const { currentFolder } = useSidebarStore();
  const { commandModel, setCommandModel } = useDashboardStore();

  return (
    <div className="flex flex-col justify-center py-1 px-2 sticky h-10 top-10 z-5">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <ShowTitle />
          <Select
            value={commandModel}
            onValueChange={(v) =>
              setCommandModel(v as (typeof COMMAND_MODEL_OPTIONS)[number])
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              {COMMAND_MODEL_OPTIONS.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
