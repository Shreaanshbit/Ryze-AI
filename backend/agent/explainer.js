function explainer(userInput, uiPlan, previousPlan = null) {
  const newComponents = (uiPlan.components || []).map(c => c.type);

  let changeSummary = "Initial UI generation.";

  if (previousPlan && previousPlan.components) {
    const oldComponents = previousPlan.components.map(c => c.type);
    const added = newComponents.filter(c => !oldComponents.includes(c));
    const removed = oldComponents.filter(c => !newComponents.includes(c));

    if (added.length || removed.length) {
      changeSummary = `Changes applied: ${added.length ? `Added ${added.join(", ")}` : ""}${added.length && removed.length ? " | " : ""}${removed.length ? `Removed ${removed.join(", ")}` : ""}`;
    } else {
      changeSummary = "No structural component changes detected.";
    }
  }

  return `User request: "${userInput}"
Layout: ${uiPlan.layout}
Components: ${newComponents.join(", ")}
${changeSummary}
Only predefined components were used to maintain deterministic rendering.`;
}

module.exports = explainer;