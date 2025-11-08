import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ Missing OPENAI_API_KEY in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,

});

/**
 * توليد محتوى الملاحظة بناءً على العنوان بشكل مختصر ونظيف
 * @param title عنوان الملاحظة
 * @returns نص الملاحظة بصيغة Markdown بدون كود أو خطوات مفصلة
 */
export async function generateNoteBody(title: string): Promise<string> {
  try {
    const prompt = `
You are NoteBuddy, an AI assistant for the Rivorea Note app.
Given the title: "${title}"

Instructions:
- Write a clear, concise, helpful note based on the title.
- Prefer plain text for explanations.


- Do not repeat the title in the note.
- Keep everything easy to read and clear and maybe long if user wants.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
    });

    const text =
      response.choices?.[0]?.message?.content || "Could not generate note";
    return text.trim();
  } catch (error) {
    console.error("❌ Error in generateNoteBody:", error);
    throw new Error("Failed to generate note body");
  }
}
