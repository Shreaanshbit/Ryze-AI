/**
 * convert natural language and previous UI plan into a deterministic UI Plan.
 * Enforces compnent whitelist using a structured Schema . 
 */

const { generateJson } = require("../llm/geminiClient");

const ALLOWED_COMPONENTS = ["Button", "Card", "Input", "Modal", "Sidebar", "Navbar", "Table", "Chart"];

const PLAN_SCHEMA = {
  type: "object",
  properties: {
    layout: { type: "string" },
    components: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          props: {
            type: "object",
            properties: {
              title: { type: "string" },
              label: { type: "string" },
              placeholder: { type: "string" }
            }
          }
        },
        required: ["type"]
      }
    }
  },
  required: ["layout", "components"]
};

function sanitizePlan(plan) {
  const layout = typeof plan.layout === "string" ? plan.layout : "single-column";
  const components = Array.isArray(plan.components) ? plan.components : [];

  const cleaned = components
    .map((c) => {
      const type = typeof c.type === "string" ? c.type : "";
      let props;

      if (c && c.props && typeof c.props === "object") {
        props = {};
        if (typeof c.props.title === "string") props.title = c.props.title;
        if (typeof c.props.label === "string") props.label = c.props.label;
        if (typeof c.props.placeholder === "string") props.placeholder = c.props.placeholder;
        if (!Object.keys(props).length) props = undefined;
      }

      return props ? { type, props } : { type };
    })
    .filter((c) => ALLOWED_COMPONENTS.includes(c.type));

  return {
    layout,
    components: cleaned.length ? cleaned : [{ type: "Card", props: { title: "Default Card" } }]
  };
}

async function planner(userInput, previousPlan = null) {
  if (!userInput || typeof userInput !== "string") throw new Error("Invalid user input");

  const systemInstruction =
    `You are the PLANNER in a deterministic UI generator.
Return ONLY JSON that matches the schema.
Use ONLY components: ${ALLOWED_COMPONENTS.join(", ")}.
No React code. No markdown. No extra keys.
If previousPlan exists, apply minimal edits (preserve existing components unless asked to remove).`;

  const userText = JSON.stringify({ userInput, previousPlan }, null, 2);

  const plan = await generateJson({
    systemInstruction,
    userText,
    schema: PLAN_SCHEMA,
    temperature: 0.1
  });

  return sanitizePlan(plan);
}

module.exports = planner;