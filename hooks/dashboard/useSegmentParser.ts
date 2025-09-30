import { useCallback } from "react";
import {
  SEGMENT_START_FRAG,
  SEGMENT_END_FRAG,
  SEGMENT_SEPARATOR,
} from "@/constants/dashboard";
import type { PendingSegment } from "@/types/dashboard";

export function useSegmentParser() {
  const replacePendingSegment = useCallback(
    (content: string, segment: PendingSegment): string | null => {
      const startToken = `${SEGMENT_START_FRAG}${segment.query}`;
      const startIndex = content.indexOf(startToken);
      if (startIndex === -1) {
        return null;
      }

      const searchFrom = startIndex + startToken.length;
      const endIndex = content.indexOf(SEGMENT_END_FRAG, searchFrom);
      if (endIndex === -1) {
        return null;
      }

      const before = content.slice(0, startIndex);
      const after = content.slice(endIndex + SEGMENT_END_FRAG.length);
      return `${before}${segment.replacement}${after}`;
    },
    [],
  );

  const extractLatestQuery = useCallback((content: string): string | null => {
    const arrowPositions: number[] = [];
    let searchIndex = 0;

    while (true) {
      const arrowIndex = content.indexOf(SEGMENT_END_FRAG, searchIndex);
      if (arrowIndex === -1) break;
      arrowPositions.push(arrowIndex);
      searchIndex = arrowIndex + SEGMENT_END_FRAG.length;
    }

    const extractedTexts: string[] = [];
    for (const arrowPos of arrowPositions) {
      const precedingText = content.substring(0, arrowPos);
      const lastArrowIndex = precedingText.lastIndexOf(SEGMENT_START_FRAG);

      if (lastArrowIndex !== -1) {
        const textBetween = precedingText.substring(
          lastArrowIndex + SEGMENT_START_FRAG.length,
        );
        extractedTexts.push(textBetween);
      }
    }

    const filteredTexts = extractedTexts
      .filter(
        (text) =>
          !text.includes(SEGMENT_SEPARATOR) && !text.includes(SEGMENT_END_FRAG),
      )
      .filter(Boolean);

    return filteredTexts[filteredTexts.length - 1] || null;
  }, []);

  const countEndFragments = useCallback((content: string): number => {
    return content.split(SEGMENT_END_FRAG).length - 1;
  }, []);

  return {
    replacePendingSegment,
    extractLatestQuery,
    countEndFragments,
  };
}
