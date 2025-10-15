"use client";

import { useDashboardStore } from "@/store/dashboard";
import { useCallback, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useCommandAgent } from "@/hooks/dashboard/useCommandAgent";
import { useAutoSave } from "@/hooks/dashboard/useAutoSave";
import { useSegmentParser } from "@/hooks/dashboard/useSegmentParser";
import { DashboardHeader } from "@/components/dashboard/header";
import { EditorTextarea } from "@/components/dashboard/EditorTextarea";
import {
  SEGMENT_START_FRAG,
  SEGMENT_END_FRAG,
  DELETE_START_FRAG,
  DELETE_END_FRAG,
} from "@/constants/dashboard";

export default function Dashboard() {
  const { currentFile, setCurrentFile } = useDashboardStore();
  const { isMobile, setOpenMobile } = useSidebar();

  const { processCommandAgent, pendingSegment, setPendingSegment } =
    useCommandAgent(currentFile?.content);
  const { scheduleAutoSave } = useAutoSave(processCommandAgent);
  const { replacePendingSegment } = useSegmentParser(
    SEGMENT_START_FRAG,
    SEGMENT_END_FRAG,
  );
  const { removeSegments } = useSegmentParser(
    DELETE_START_FRAG,
    DELETE_END_FRAG,
  );

  useEffect(() => {
    if (isMobile && !currentFile) {
      setOpenMobile(true);
    }
  }, [currentFile, isMobile, setOpenMobile]);

  useEffect(() => {
    if (!pendingSegment) return;
    if (!currentFile) {
      setPendingSegment(null);
      return;
    }

    const currentContent = currentFile.content || "";
    const updatedContent = replacePendingSegment(
      currentContent,
      pendingSegment,
    );

    if (updatedContent === null) {
      setPendingSegment(null);
      return;
    }

    if (updatedContent !== currentContent) {
      setCurrentFile({ ...currentFile, content: updatedContent });
    }
    setPendingSegment(null);
  }, [
    pendingSegment,
    currentFile,
    replacePendingSegment,
    setCurrentFile,
    setPendingSegment,
  ]);

  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (currentFile) {
        let content = e.target.value;
        content = removeSegments(content);

        const updatedFile = { ...currentFile, content };
        setCurrentFile(updatedFile);

        scheduleAutoSave(
          updatedFile.id,
          updatedFile.title || "",
          updatedFile.content || "",
        );
      }
    },
    [currentFile, setCurrentFile, scheduleAutoSave, removeSegments],
  );

  return (
    <>
      <DashboardHeader />
      <EditorTextarea
        value={currentFile?.content || ""}
        onChange={handleTextAreaChange}
        disabled={!currentFile}
      />
    </>
  );
}
