import { useCallback } from "react";
import { SEGMENT_SEPARATOR } from "@/constants/dashboard";
import type { PendingSegment } from "@/types/dashboard";

export function useSegmentParser(startToken: string, endToken: string) {
  const replacePendingSegment = useCallback(
    (content: string, segment: PendingSegment): string | null => {
      const startTokenWithQuery = `${startToken}${segment.query}`;
      const startIndex = content.indexOf(startTokenWithQuery);
      if (startIndex === -1) {
        return null;
      }

      const searchFrom = startIndex + startTokenWithQuery.length;
      const endIndex = content.indexOf(endToken, searchFrom);
      if (endIndex === -1) {
        return null;
      }

      const before = content.slice(0, startIndex);
      const after = content.slice(endIndex + endToken.length);
      return `${before}${segment.replacement}${after}`;
    },
    [startToken, endToken],
  );

  const extractLatestQuery = useCallback(
    (content: string): string | null => {
      const arrowPositions: number[] = [];
      let searchIndex = 0;

      while (true) {
        const arrowIndex = content.indexOf(endToken, searchIndex);
        if (arrowIndex === -1) break;
        arrowPositions.push(arrowIndex);
        searchIndex = arrowIndex + endToken.length;
      }

      const extractedTexts: string[] = [];
      for (const arrowPos of arrowPositions) {
        const precedingText = content.substring(0, arrowPos);
        const lastArrowIndex = precedingText.lastIndexOf(startToken);

        if (lastArrowIndex !== -1) {
          const textBetween = precedingText.substring(
            lastArrowIndex + startToken.length,
          );
          extractedTexts.push(textBetween);
        }
      }

      const filteredTexts = extractedTexts
        .filter(
          (text) =>
            !text.includes(SEGMENT_SEPARATOR) && !text.includes(endToken),
        )
        .filter(Boolean);

      return filteredTexts[filteredTexts.length - 1] || null;
    },
    [startToken, endToken],
  );

  const countEndFragments = useCallback(
    (content: string): number => {
      return content.split(endToken).length - 1;
    },
    [endToken],
  );

  const removeSegments = useCallback(
    (content: string): string => {
      let result = content;
      let searchIndex = 0;

      while (true) {
        const startIndex = result.indexOf(startToken, searchIndex);
        if (startIndex === -1) break;

        const endIndex = result.indexOf(
          endToken,
          startIndex + startToken.length,
        );
        if (endIndex === -1) break;

        const before = result.slice(0, startIndex);
        const after = result.slice(endIndex + endToken.length);
        result = before + after;
        searchIndex = startIndex;
      }

      return result;
    },
    [startToken, endToken],
  );

  return {
    replacePendingSegment,
    extractLatestQuery,
    countEndFragments,
    removeSegments,
  };
}
