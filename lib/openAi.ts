import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate note content based on a title/prompt using Google Gemini
 * @param title The note title or user message
 * @returns Generated text
 */
export async function generateNoteBody(title: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction:
        "You are NoteBuddy, an AI assistant built into the Rivorea Note app. " +
        "Your sole purpose is to help users write, edit, and improve their notes — nothing else. " +
        "If a user asks about something unrelated to notes or writing, politely redirect them: " +
        "let them know you're only here to help with their notes. " +
        "Tone: friendly, warm, and casual — like a helpful writing buddy, not a formal assistant. " +
        "Feel free to use light, natural language, but always stay focused and useful. " +
        "Response style: " +
        "- Get straight to the point. Never restate or echo the user's question. " +
        "- Use plain text. Avoid markdown, bullet points, or headers unless the user explicitly asks. " +
        "- Keep responses short by default. Only go longer when the writing task genuinely needs it. " +
        "- When improving or rewriting note content, show the result directly — skip the meta-commentary.",
    });

    const result = await model.generateContent(title);
    const text = result.response.text();

    if (!text) throw new Error("Empty response from Gemini");
    return text.trim();
  } catch (error) {
    console.error("❌ Error in generateNoteBody:", error);
    throw new Error("Failed to generate note body");
  }
}
