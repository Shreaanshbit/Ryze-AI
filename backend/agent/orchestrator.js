const planner = require("./planner");
const generator = require("./generator");
const explainer = require("./explainer");
const validateCode = require("../validator/validateCode");
const versionStore = require("../store/versionStore");

async function orchestrator(userInput) {
  if (!userInput || typeof userInput !== "string") throw new Error("User input is required");

  const previousVersion = versionStore.getCurrentVersion();
  const previousPlan = previousVersion ? previousVersion.uiPlan : null;

  const uiPlan = await planner(userInput, previousPlan);

  const code = await generator(uiPlan);

  const validation = validateCode(code);
  if (!validation.valid) return { success: false, error: validation.error };

  const explanation = await explainer(userInput, uiPlan, previousPlan);

  const saved = versionStore.saveVersion(code, explanation, uiPlan);

  return { success: true, versionId: saved.id, code, explanation };
}

module.exports = orchestrator;