async function planner(userInput, previousState = null) {
  if (!userInput || typeof userInput !== "string") {
    throw new Error("Invalid user input");
  }

  const intent = userInput.toLowerCase();

  const plan = {
    layout: "single-column",
    components: [],
    mode: previousState ? "modify" : "create"
  };

  if (intent.includes("dashboard")) {
    plan.layout = "sidebar-main";
    plan.components.push(
      { type: "Sidebar" },
      { type: "Card", props: { title: "Overview" } },
      { type: "Card", props: { title: "Statistics" } }
    );
  }

  if (intent.includes("modal")) {
    plan.components.push({ type: "Modal", props: { title: "Settings" } });
  }

  if (intent.includes("table")) {
    plan.components.push({ type: "Table" });
  }

  if (intent.includes("chart")) {
    plan.components.push({ type: "Chart" });
  }

  if (plan.components.length === 0) {
    plan.components.push({ type: "Card", props: { title: "Default Card" } });
  }

  return plan;
}

module.exports = planner;