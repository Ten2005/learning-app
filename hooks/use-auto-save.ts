import { useEffect, useRef } from "react";

type SaveCallback = (signal: AbortSignal) => Promise<void>;

export function useAutoSave(
  trigger: unknown,
  delay: number,
  saveCallback: SaveCallback,
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortRef = useRef<AbortController>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      saveCallback(controller.signal).catch((error) => {
        if ((error as Error).name !== "AbortError") {
          console.error("Auto-save failed:", error);
        }
      });
    }, delay);

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      abortRef.current?.abort();
    };
  }, [trigger, delay, saveCallback]);
}
