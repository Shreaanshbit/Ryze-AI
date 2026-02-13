/**
 * convert structured UI Plan into a valid React code keeping using only the allowed components.
 */

const { generateText } = require("../llm/geminiClient");

const ALLOWED_COMPONENTS = ["Button", "Card", "Input", "Modal", "Sidebar", "Navbar", "Table", "Chart"];

async function generator(uiPlan) {
  if (!uiPlan || !Array.isArray(uiPlan.components)) throw new Error("Invalid plan");

  const systemInstruction =
    `You are the GENERATOR.
Output ONLY valid React code (no markdown, no explanation).

Rules:
- Import ONLY the components that appear in uiPlan.components.
- Do NOT import unused components.
- Import exactly from "./components".
- You may use ONLY these components: ${ALLOWED_COMPONENTS.join(", ")}.
- Define ONLY: export default function GeneratedUI() { ... }
- No inline styles.
- No className.
- No HTML tags like div, section, main.
- Render components in the order provided in uiPlan.
If uiPlan.__fix exists, correct the output according to the validation error while still following all rules.`;

  const userText = JSON.stringify({ uiPlan }, null, 2);

  const code = await generateText({
    systemInstruction,
    userText,
    temperature: 0.1
  });

  return code;
}

module.exports = generator;