import { GoogleGenerativeAI } from "@google/generative-ai";

export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateNoteBody(title: string): Promise<string> {
  const prompt = `
You are NoteBuddy, a note-taking assistant for our app.
Write a short note body based on the following title: "${title}".
Do not answer anything outside of note generation.
  `;

  const response = await model.generateContent(prompt);
  return response.response.text();
}
