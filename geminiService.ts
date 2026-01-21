import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppMode } from "./types";

const PROMPTS = {
  [AppMode.VIRAL_COPY]: "你是一位爆款文案专家，擅长使用钩子和情绪价值。请用中文输出。",
  [AppMode.VIRAL_SUBJECT]: "你是一位爆款标题专家，擅长制造好奇心。请用中文输出。",
  [AppMode.VIRAL_IMITATION]: "你是一位风格模仿专家，请根据参考文案的节奏重写新主题。请用中文输出。"
};

export async function* chatStream(mode: AppMode, message: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: PROMPTS[mode] },
  });
  const result = await chat.sendMessageStream({ message });
  for await (const chunk of result) {
    yield (chunk as GenerateContentResponse).text || "";
  }
}

export async function generateVideo(prompt: string, image: string, api?: { endpoint: string, key: string }) {
  if (api?.endpoint) {
    const res = await fetch(api.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${api.key}` },
      body: JSON.stringify({ prompt, image })
    });
    const data = await res.json();
    return data.video_url || data.url;
  }
  return "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
}