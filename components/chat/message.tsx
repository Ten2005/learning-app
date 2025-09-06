"use client";

import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { markdownComponents } from "@/components/chat/markdownComponents";

function TypingIndicator() {
  return (
    <div className="flex gap-1 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

export function Message({
  parts,
  isUser,
}: {
  parts: UIMessage["parts"];
  isUser: boolean;
}) {
  const isTyping =
    !isUser &&
    (parts.length === 0 ||
      parts.every(
        (part) => part.type === "text" && part.text.length === 0,
      ));

  return (
    <div className={cn("flex flex-row gap-2 items-end", !isUser && "w-full")}>
      <div
        className={cn(
          "flex flex-col gap-2 text-sm",
          isUser &&
            "rounded-lg px-3 py-2 bg-primary text-primary-foreground ml-auto w-max max-w-[75%]",
        )}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          parts.map((part: UIMessage["parts"][number], i: number) => {
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
          })
        )}
      </div>
    </div>
  );
}
