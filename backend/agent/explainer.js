function explainer(userInput, plan) {
  if (!plan || !plan.components) {
    throw new Error("Invalid plan for explanation");
  }

  const componentList = plan.components.map(c => c.type).join(", ");

  const explanation = `
The system interpreted your request as: "${userInput}".

Layout selected: ${plan.layout}.

Components used: ${componentList}.

The layout and components were chosen based on detected keywords and structured intent mapping. 
Only predefined components were used to ensure deterministic rendering and system safety.
  `.trim();

  return explanation;
}

module.exports = explainer;