import { experimental_generateSpeech as generateSpeech } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateSpeechFunction(text: string, voice: string) {
  const result = await generateSpeech({
    model: openai.speech("tts-1"),
    text: text,
    voice: voice,
  });
  return result.audio; // audio data e.g. Uint8Array
}
