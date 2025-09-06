"use client";

import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { markdownComponents } from "@/components/chat/markdownComponents";

export function Message({
  parts,
  isUser,
}: {
  parts: UIMessage["parts"];
  isUser: boolean;
}) {
  return (
    <div className="flex flex-row gap-2 items-end">
      <div
        className={cn(
          "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted",
        )}
      >
        {parts.map((part: UIMessage["parts"][number], i: number) => {
          switch (part.type) {
            case "text": {
              if (isUser) {
                return <div key={`${i}`}>{part.text}</div>;
              }
              return (
                <ReactMarkdown
                  key={`${i}`}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {part.text}
                </ReactMarkdown>
              );
            }
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
