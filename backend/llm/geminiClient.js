const { GoogleGenAI } = require("@google/genai");

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");
  return new GoogleGenAI({ apiKey });
}

async function generateText({ systemInstruction, userText, temperature = 0.2 }) {
  const ai = getClient();
  const model = process.env.GEMINI_MODEL || "gemini-3-flash";

  const resp = await ai.models.generateContent({
    model,
    contents: userText,
    config: { systemInstruction, temperature }
  });

  return String(resp.text || "").trim();
}

async function generateJson({ systemInstruction, userText, schema, temperature = 0.1 }) {
  const ai = getClient();
  const model = process.env.GEMINI_MODEL || "gemini-3-flash";

  const resp = await ai.models.generateContent({
    model,
    contents: userText,
    config: {
      systemInstruction,
      temperature,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  const raw = String(resp.text || "").trim();
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }
}

module.exports = { generateText, generateJson };