import { marked } from "marked";
import { JSDOM } from "jsdom";

export async function removeMarkdown(markdown: string): Promise<string> {
  const html = await marked(markdown);
  const dom = new JSDOM(html);
  const text = dom.window.document.body.textContent || "";
  return text;
}
