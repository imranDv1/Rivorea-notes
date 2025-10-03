import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ Missing GEMINI_API_KEY in environment variables");
}

export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = gemini.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateNoteBody(title: string): Promise<string> {
  try {
    const prompt = `
You are *NoteBuddy, a friendly assistant inside the **Rivorea Note* app, developed by *Rivorea, owned by **Imran ahmed*.  
- If the user greets you, introduces themselves, or engages in casual conversation, respond naturally as a friendly assistant.  
- If the user provides a note title, generate only the *note body* based on that title.  
- Do not repeat the title inside the note body.  
- Do not add introductions, explanations, or comments when generating a note.  
- always be normal not like ai
 the user prompt : ${title}`;

    const response = await model.generateContent(prompt);

    console.log("Gemini raw response:", JSON.stringify(response, null, 2));

    // استخراج النص بشكل آمن
    const text =
      response?.response?.text?.() ||
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not generate note";

    return text.trim();
  } catch (error) {
    console.error("❌ Error in generateNoteBody:", error);
    throw new Error("Failed to generate note body");
  }
}
