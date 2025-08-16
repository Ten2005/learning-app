"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboard";
import { CheckIcon, PencilIcon, TelescopeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePageButton from "@/components/dashboard/createPageButton";
import PageButtons from "@/components/dashboard/pageButton";
import { Input } from "@/components/ui/input";
import { useSidebarStore } from "@/store/sidebar";
import { updateFileAction } from "./actions";

export default function Dashboard() {
  const { currentFile, setCurrentFile, isEditingTitle } = useDashboardStore();
  const { currentFolder } = useSidebarStore();

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex flex-col gap-2 justify-between border-b p-2">
        <div className="flex flex-row justify-between">
          {currentFile && (isEditingTitle ? <EditTitle /> : <ShowTitle />)}
          {currentFolder && <PageButtons />}
        </div>
        <div className="flex flex-row items-end justify-between">
          <Button variant="outline" size="icon" className="size-8">
            <TelescopeIcon />
          </Button>
          <CreatePageButton />
        </div>
      </div>
      <Textarea
        value={currentFile?.content || ""}
        onChange={(e) => {
          if (currentFile) {
            setCurrentFile({ ...currentFile, content: e.target.value });
          }
        }}
        className="
        w-full flex-1
        resize-none border-none focus:border-none focus-visible:ring-0"
      />
    </div>
  );
}

function EditTitle() {
  const { currentFile, setCurrentFile, setIsEditingTitle } =
    useDashboardStore();

  const handleUpdateTitle = () => {
    setIsEditingTitle(false);
    if (currentFile) {
      updateFileAction(
        currentFile.id,
        currentFile.title || "",
        currentFile.content || "",
      );
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleUpdateTitle}>
        <CheckIcon className="w-4 h-4 text-muted-foreground" />
      </Button>
      <Input
        type="text"
        value={currentFile?.title || ""}
        onChange={(e) => {
          if (currentFile) {
            setCurrentFile({ ...currentFile, title: e.target.value });
          }
        }}
      />
    </div>
  );
}

function ShowTitle() {
  const { setIsEditingTitle } = useDashboardStore();
  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditingTitle(true)}
      >
        <PencilIcon className="w-4 h-4 text-muted-foreground" />
      </Button>
      <TitleLabel />
    </div>
  );
}

function TitleLabel() {
  const { currentFile } = useDashboardStore();
  return currentFile?.title ? (
    <Label className="text-primary">{currentFile?.title}</Label>
  ) : (
    <Label className="text-muted-foreground">None</Label>
  );
}
