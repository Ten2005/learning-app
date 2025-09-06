import { type Components } from "react-markdown";
import { cn } from "@/lib/utils";

export const markdownComponents: Components = {
  code: ({ className, children, ...props }) => (
    <code
      className={cn(
        "rounded bg-background px-1 py-[2px] font-mono text-xs",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className={cn(
        "w-full overflow-x-auto rounded-md border bg-background p-3 text-xs leading-relaxed",
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  p: ({ children }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-2">{children}</p>
  ),
  a: ({ children, href }) => (
    <a href={href} className="underline underline-offset-4 text-primary">
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-muted-foreground/30" />,
  h1: ({ children }) => (
    <h1 className="text-xl font-semibold mt-3">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold mt-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-3">{children}</h3>
  ),
  table: ({ children }) => (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b px-2 py-1 font-medium">{children}</th>
  ),
  td: ({ children }) => <td className="border-b px-2 py-1">{children}</td>,
};
