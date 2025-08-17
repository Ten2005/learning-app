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
  const { currentFile, setCurrentFile, isEditingTitle, isTextAreaDisabled } =
    useDashboardStore();
  const { currentFolder } = useSidebarStore();

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentFile) {
      setCurrentFile({ ...currentFile, content: e.target.value });
    }
  };

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
        <div className="flex flex-row border-t pt-2">
          <EditTextAreaButton />
        </div>
      </div>
      <Textarea
        value={currentFile?.content || ""}
        onChange={handleTextAreaChange}
        disabled={isTextAreaDisabled || !currentFile}
        className="
        w-full flex-1
        resize-none border-none focus:border-none focus-visible:ring-0"
      />
    </div>
  );
}

function EditTextAreaButton() {
  const { setIsTextAreaDisabled, isTextAreaDisabled, currentFile } =
    useDashboardStore();
  const { currentFiles, setCurrentFiles } = useSidebarStore();

  const handleSave = async () => {
    setIsTextAreaDisabled(true);
    if (currentFile) {
      await updateFileAction(
        currentFile.id,
        currentFile.title || "",
        currentFile.content || "",
      );
      setCurrentFiles(
        currentFiles.map((file) =>
          file.id === currentFile.id
            ? { ...file, content: currentFile.content }
            : file,
        ),
      );
    }
  };

  return isTextAreaDisabled ? (
    <Button
      size="sm"
      variant="secondary"
      disabled={!currentFile}
      onClick={() => setIsTextAreaDisabled(false)}
    >
      Edit
    </Button>
  ) : (
    <Button size="sm" onClick={handleSave} disabled={!currentFile}>
      Save
    </Button>
  );
}

function EditTitle() {
  const { currentFile, setCurrentFile, setIsEditingTitle } =
    useDashboardStore();

  const { currentFiles, setCurrentFiles } = useSidebarStore();

  const handleUpdateTitle = async () => {
    setIsEditingTitle(false);
    if (currentFile) {
      await updateFileAction(
        currentFile.id,
        currentFile.title || "",
        currentFile.content || "",
      );
      setCurrentFiles(
        currentFiles.map((file) =>
          file.id === currentFile.id
            ? { ...file, title: currentFile.title }
            : file,
        ),
      );
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <Button variant="ghost" size="icon" onClick={handleUpdateTitle}>
        <CheckIcon className="w-4 h-4 " />
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
        <PencilIcon className="w-4 h-4" />
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
