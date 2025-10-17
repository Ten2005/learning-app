"use client";

import { useDashboardStore } from "@/store/dashboard";
import { useCallback, useEffect, useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (isMobile) {
      if (!currentFile) {
        setOpenMobile(true);
      } else {
        // モバイルでファイルが選択されたらサイドバーを閉じる
        setOpenMobile(false);
      }
    }
  }, [currentFile, isMobile, setOpenMobile]);

  // ファイルが切り替わったときにカーソルを最後に移動
  useEffect(() => {
    if (currentFile && textareaRef.current) {
      // contentが空の場合は明示的に空文字列を設定
      if (!currentFile.content) {
        setCurrentFile({ ...currentFile, content: "" });
      }
      const content = currentFile.content || "";
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(content.length, content.length);
          textareaRef.current.focus();
        }
      }, 0);
    }
  }, [currentFile, setCurrentFile]);

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
        const content = e.target.value;
        const { newContent, cursorPosition } = removeSegments(content);

        const updatedFile = { ...currentFile, content: newContent };
        setCurrentFile(updatedFile);

        scheduleAutoSave(
          updatedFile.id,
          updatedFile.title || "",
          updatedFile.content || "",
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
      <DashboardHeader />
      <EditorTextarea
        ref={textareaRef}
        value={currentFile?.content || ""}
        onChange={handleTextAreaChange}
        disabled={!currentFile}
      />
    </>
  );
}
