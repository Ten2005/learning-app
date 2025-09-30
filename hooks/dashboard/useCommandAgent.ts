import { useCallback, useRef, useState } from "react";
import {
  SEGMENT_START_FRAG,
  SEGMENT_END_FRAG,
  SEGMENT_SEPARATOR,
} from "@/constants/dashboard";
import type { PendingSegment, CommandAgentResponse } from "@/types/dashboard";
import { useSegmentParser } from "@/hooks/dashboard/useSegmentParser";

export function useCommandAgent(currentFileContent: string | undefined) {
  const [arrowCount, setArrowCount] = useState(0);
  const initialized = useRef(false);
  const [pendingSegment, setPendingSegment] = useState<PendingSegment | null>(
    null,
  );

  const { extractLatestQuery, countEndFragments } = useSegmentParser(
    SEGMENT_START_FRAG,
    SEGMENT_END_FRAG,
  );

  const processCommandAgent = useCallback(async (): Promise<string | null> => {
    if (!currentFileContent) return null;

    const newArrowCount = countEndFragments(currentFileContent);

    if (!initialized.current) {
      initialized.current = true;
      setArrowCount(newArrowCount);
      return null;
    }

    if (newArrowCount > arrowCount) {
      const query = extractLatestQuery(currentFileContent);

      if (!query) {
        setArrowCount(newArrowCount);
        return null;
      }

      try {
        const result = await fetch("/api/chat/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: query }),
        });

        if (!result.ok) {
          console.error("commandAgent error", result.statusText);
          return null;
        }

        const data: CommandAgentResponse = await result.json();
        const responseText = data.text ?? "";

        const updatedSegment = `${SEGMENT_START_FRAG}\n${query}\n${SEGMENT_SEPARATOR}\n${responseText}\n${SEGMENT_END_FRAG}`;

        setPendingSegment({ query, replacement: updatedSegment });
        setArrowCount(newArrowCount);

        return updatedSegment;
      } catch (error) {
        console.error("Command agent failed:", error);
        setArrowCount(newArrowCount);
        return null;
      }
    }

    setArrowCount(newArrowCount);
    return null;
  }, [currentFileContent, arrowCount, extractLatestQuery, countEndFragments]);

  return {
    processCommandAgent,
    pendingSegment,
    setPendingSegment,
  };
}
