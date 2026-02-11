const planner = require("./planner");
const generator = require("./generator");
const explainer = require("./explainer");
const validateCode = require("../validator/validateCode");
const {
  saveVersion,
  getCurrentVersion
} = require("../store/versionStore");

async function orchestrator(userInput) {
  if (!userInput) {
    throw new Error("User input is required");
  }

  const previousVersion = getCurrentVersion();

  const plan = await planner(userInput, previousVersion);

  const code = generator(plan);

  const validation = validateCode(code);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    };
  }

  const explanation = explainer(userInput, plan);

  const version = saveVersion(code, explanation);

  return {
    success: true,
    versionId: version.id,
    code,
    explanation
  };
}

module.exports = orchestrator;