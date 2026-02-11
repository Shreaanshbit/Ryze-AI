async function planner(userInput, previousPlan = null) {
  if (!userInput || typeof userInput !== "string") {
    throw new Error("Invalid user input");
  }

  const intent = userInput.toLowerCase();

  if (!previousPlan) {
    return createNewPlan(intent);
  }

  return modifyExistingPlan(intent, previousPlan);
}

function createNewPlan(intent) {
  const plan = {
    layout: "single-column",
    components: []
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

function modifyExistingPlan(intent, existingPlan) {
  const updatedPlan = {
    layout: existingPlan.layout,
    components: [...existingPlan.components]
  };

  const addModal =
    intent.includes("add modal") ||
    (intent.includes("modal") && !intent.includes("remove"));

  const removeModal = intent.includes("remove modal");

  const addChart =
    intent.includes("add chart") ||
    (intent.includes("chart") && !intent.includes("remove"));

  const removeChart = intent.includes("remove chart");

  if (addModal) {
    const hasModal = updatedPlan.components.some(c => c.type === "Modal");
    if (!hasModal) {
      updatedPlan.components.push({ type: "Modal", props: { title: "Settings" } });
    }
  }

  if (removeModal) {
    updatedPlan.components = updatedPlan.components.filter(c => c.type !== "Modal");
  }

  if (addChart) {
    const hasChart = updatedPlan.components.some(c => c.type === "Chart");
    if (!hasChart) {
      updatedPlan.components.push({ type: "Chart" });
    }
  }

  if (removeChart) {
    updatedPlan.components = updatedPlan.components.filter(c => c.type !== "Chart");
  }

  if (intent.includes("minimal")) {
    updatedPlan.components = updatedPlan.components.filter(
      c => c.type === "Sidebar" || c.type === "Navbar" || c.type === "Card"
    );
  }

  return updatedPlan;
}
module.exports = planner;