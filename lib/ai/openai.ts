import OpenAI from "openai";
import { Message } from "@/types/chat/message";


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (messages: Message[]) => {
    const response = await client.responses.create({
    model: "gpt-5-nano",
    reasoning: { effort: "low" },
    input: [
        {
            role: "developer",
            content: "You are a helpful assistant that can answer questions and help with tasks. You are given a query and you need to answer it."
        },
        ...messages,
    ],
  });

  return response.output_text;
};