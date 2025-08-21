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
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col justify-between py-1 px-2">
        <div className="flex flex-row justify-between border-b pb-1">
          {currentFolder && <PageButtons />}
          {currentFile && (isEditingTitle ? <EditTitle /> : <ShowTitle />)}
        </div>
        <div className="flex flex-row justify-between border-b py-1">
          <CreatePageButton />
          <EditTextAreaButton />
        </div>
        <div className="flex flex-row justify-end pt-1">
          <Button variant="outline" size="icon" className="size-8">
            <TelescopeIcon />
          </Button>
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
    <div className="flex flex-row items-center gap-1">
      <Input
        type="text"
        value={currentFile?.title || ""}
        onChange={(e) => {
          if (currentFile) {
            setCurrentFile({ ...currentFile, title: e.target.value });
          }
        }}
      />
      <Button variant="ghost" size="icon" onClick={handleUpdateTitle}>
        <CheckIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

function ShowTitle() {
  return (
    <div className="flex flex-row items-center">
      <TitleLabel />
    </div>
  );
}

function TitleLabel() {
  const { currentFile } = useDashboardStore();
  const { setIsEditingTitle } = useDashboardStore();
  return currentFile?.title ? (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsEditingTitle(true)}
      asChild
    >
      <Label className="text-primary">{currentFile?.title}</Label>
    </Button>
  ) : (
    <Label className="text-muted-foreground">None</Label>
  );
}
