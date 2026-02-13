/**
 * produces concise bullet point explanation for the UI changes.
 *  
 */
const { generateText } = require("../llm/geminiClient");

async function explainer(userInput, uiPlan, previousPlan = null) {
  const systemInstruction = `
You are the EXPLAINER in a deterministic UI generator.

Rules:
- Output plain text only.
- Use dash "-" for bullet points.
- No markdown formatting.
- No asterisks.
- No headings.
- Maximum 6 bullet points.
- Clearly describe what changed compared to previousPlan (if present).
- Be concise and professional.

Example format:
- The dashboard layout was preserved.
- A Modal component was added.
- No other components were modified.
`.trim();
  const userText = JSON.stringify({ userInput, uiPlan, previousPlan }, null, 2);

  return await generateText({
    systemInstruction,
    userText,
    temperature: 0.2
  });
}

module.exports = explainer;