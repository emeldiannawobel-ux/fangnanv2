import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppMode } from "./types";

const SYSTEM_PROMPTS = {
  [AppMode.VIRAL_COPY]: "你是一位世界级的爆款文案专家，擅长小红书、抖音钩子文学。请用中文回答，直接输出文案内容。",
  [AppMode.VIRAL_SUBJECT]: "你是一位爆款标题大师，擅长制造点击欲望和好奇心。请提供5个不同风格的爆款标题。",
  [AppMode.VIRAL_IMITATION]: "你是一位风格模仿专家，深度解析参考文案的节奏和逻辑，并应用到新主题。请用中文回答。"
};

export async function* chatStream(mode: AppMode, userMessage: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: SYSTEM_PROMPTS[mode] },
  });

  const result = await chat.sendMessageStream({ message: userMessage });
  for await (const chunk of result) {
    const c = chunk as GenerateContentResponse;
    yield c.text || '';
  }
}

// 供数字人分身调用，可配置自定义接口
export async function generateDigitalHumanVideo(prompt: string, image: string, customConfig?: { endpoint: string, key: string }) {
  if (customConfig?.endpoint) {
    const response = await fetch(customConfig.endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customConfig.key}`
      },
      body: JSON.stringify({ prompt, image })
    });
    const data = await response.json();
    return data.video_url || data.url;
  }
  // 模拟返回
  await new Promise(r => setTimeout(r, 2000));
  return "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
}
