"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { useCommandAgent } from "@/hooks/dashboard/useCommandAgent";
import { useSegmentParser } from "@/hooks/dashboard/useSegmentParser";
import { EditorTextarea } from "@/components/dashboard/EditorTextarea";
import { ScheduleHeader } from "@/components/schedule/header";
import {
  SEGMENT_START_FRAG,
  SEGMENT_END_FRAG,
  DELETE_START_FRAG,
  DELETE_END_FRAG,
} from "@/constants/dashboard";
import { AUTO_SAVE_DELAY_MS } from "@/constants/dashboard";
import { getOrCreateScheduleFile, updateScheduleFile } from "./actions";

interface ScheduleFile {
  id: number;
  title: string;
  content: string;
}

export default function Schedule() {
  const searchParams = useSearchParams();
  const [currentFile, setCurrentFile] = useState<ScheduleFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile, setOpenMobile } = useSidebar();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { processCommandAgent, pendingSegment, setPendingSegment } =
    useCommandAgent(currentFile?.content);
  const { replacePendingSegment } = useSegmentParser(
    SEGMENT_START_FRAG,
    SEGMENT_END_FRAG,
  );
  const { removeSegments } = useSegmentParser(
    DELETE_START_FRAG,
    DELETE_END_FRAG,
  );

  useEffect(() => {
    const date = searchParams.get("date");
    if (!date) return;

    async function loadFile() {
      setIsLoading(true);
      try {
        if (!date) return;
        const file = await getOrCreateScheduleFile(date);
        setCurrentFile(file);
      } catch (error) {
        console.error("Failed to load schedule file:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFile();
  }, [searchParams]);

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

  const scheduleAutoSave = useCallback(
    async (fileId: number, title: string, content: string) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(async () => {
        try {
          await processCommandAgent();
          await updateScheduleFile(fileId, title, content);
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
        autoSaveTimeoutRef.current = null;
      }, AUTO_SAVE_DELAY_MS);
    },
    [processCommandAgent],
  );

  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (currentFile) {
        const content = e.target.value;
        const { newContent, cursorPosition } = removeSegments(content);

        const updatedFile = { ...currentFile, content: newContent };
        setCurrentFile(updatedFile);

        scheduleAutoSave(
          updatedFile.id,
          updatedFile.title,
          updatedFile.content,
        );

        // カーソル位置を設定（削除があった場合）
        if (cursorPosition !== null && textareaRef.current) {
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.setSelectionRange(
                cursorPosition,
                cursorPosition,
              );
              textareaRef.current.focus();
            }
          }, 0);
        }
      }
    },
    [currentFile, setCurrentFile, scheduleAutoSave, removeSegments],
  );

  return (
    <>
      <ScheduleHeader />
      <EditorTextarea
        ref={textareaRef}
        value={currentFile?.content || ""}
        onChange={handleTextAreaChange}
        disabled={!currentFile || isLoading}
      />
    </>
  );
}
