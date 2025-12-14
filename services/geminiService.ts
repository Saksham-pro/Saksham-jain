import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
// Note: In a real production app, ensure the key is restricted or proxied.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = "gemini-2.5-flash";

export const generateJainQuote = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Generate a short, inspiring daily quote based on Jainism principles like Ahimsa (Non-violence), Satya (Truth), or Anekantavada (Non-absolutism). Keep it under 30 words.",
    });
    return response.text.trim();
  } catch (error) {
    console.error("Failed to generate quote:", error);
    return "Ahimsa Paramo Dharma - Non-violence is the supreme religion.";
  }
};

export const enhanceViharDescription = async (title: string, from: string, to: string): Promise<string> => {
  try {
    const prompt = `Write a short, inviting description for a Jain Vihar (pilgrimage walk) titled "${title}" starting from ${from} to ${to}. Mention peace and spiritual growth. Keep it under 50 words.`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Failed to enhance description:", error);
    return `Join us for a spiritual journey from ${from} to ${to}. Let's walk together for peace.`;
  }
};
