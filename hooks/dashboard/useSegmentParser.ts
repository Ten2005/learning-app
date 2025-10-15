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
    (
      content: string,
    ): { newContent: string; cursorPosition: number | null } => {
      const endPositions: number[] = [];
      let searchIndex = 0;

      while (true) {
        const endIndex = content.indexOf(endToken, searchIndex);
        if (endIndex === -1) break;
        endPositions.push(endIndex);
        searchIndex = endIndex + endToken.length;
      }

      const segmentsToRemove = endPositions
        .map((endPos) => {
          const precedingText = content.substring(0, endPos);
          const startPos = precedingText.lastIndexOf(startToken);

          if (startPos !== -1) {
            const segmentContent = content.substring(
              startPos,
              endPos + endToken.length,
            );
            const endTokenCount = segmentContent.split(endToken).length - 1;
            if (endTokenCount > 1) {
              return null;
            }
            return { start: startPos, end: endPos + endToken.length };
          }
          return null;
        })
        .filter((seg): seg is { start: number; end: number } => seg !== null)
        .sort((a, b) => b.start - a.start);

      // 最初に削除されるセグメント（最も前にあるもの）の開始位置を保存
      const firstSegment =
        segmentsToRemove.length > 0
          ? segmentsToRemove[segmentsToRemove.length - 1]
          : null;

      const newContent = segmentsToRemove.reduce(
        (text, seg) => text.slice(0, seg.start) + text.slice(seg.end),
        content,
      );

      // 削除があった場合、最初のセグメントの開始位置をカーソル位置として返す
      const cursorPosition = firstSegment ? firstSegment.start : null;

      return { newContent, cursorPosition };
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
