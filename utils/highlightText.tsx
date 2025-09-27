import { useMemo } from "react";

function HighlightText({ text }: { text: string }) {
  const highlightedIndices = useMemo(() => {
    const length = text.length;
    if (length === 0) return new Set<number>();

    const selectableIndices: number[] = [];
    for (let i = 0; i < length; i += 1) {
      if (text[i].trim() !== "") selectableIndices.push(i);
    }

    if (selectableIndices.length === 0) return new Set<number>();

    const targetCount = Math.max(1, Math.floor(selectableIndices.length / 1));
    const indices = new Set<number>();
    while (
      indices.size < targetCount &&
      indices.size < selectableIndices.length
    ) {
      const pick =
        selectableIndices[Math.floor(Math.random() * selectableIndices.length)];
      indices.add(pick);
    }
    return indices;
  }, [text]);

  return (
    <span>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className={highlightedIndices.has(i) ? "text-primary" : undefined}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default HighlightText;
