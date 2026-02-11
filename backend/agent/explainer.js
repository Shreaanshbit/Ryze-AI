const { generateText } = require("../llm/geminiClient");

async function explainer(userInput, uiPlan, previousPlan = null) {
  const systemInstruction =
    `You are the EXPLAINER.
Explain in plain English:
- why the layout/components were chosen
- what changed vs previousPlan (if present)
Be concise and reference component names. No code.`;

  const userText = JSON.stringify({ userInput, uiPlan, previousPlan }, null, 2);

  return await generateText({
    systemInstruction,
    userText,
    temperature: 0.2
  });
}

module.exports = explainer;