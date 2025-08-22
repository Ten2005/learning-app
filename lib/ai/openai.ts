import OpenAI from "openai";
import { Message } from "@/types/chat/message";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (messages: Message[], systemPrompt: string = "") => {
  const response = await client.responses.create({
    model: "gpt-5-nano",
    reasoning: { effort: "low" },
    input: [
      {
        role: "developer",
        content: systemPrompt,
      },
      ...messages,
    ],
  });

  return response.output_text;
};
