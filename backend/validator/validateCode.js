const ALLOWED_COMPONENTS = [
  "Button",
  "Card",
  "Input",
  "Modal",
  "Sidebar",
  "Navbar",
  "Table",
  "Chart"
];

function validateCode(code) {
  if (!code || typeof code !== "string") {
    return { valid: false, error: "Invalid code format" };
  }

  if (code.includes("style=")) {
    return { valid: false, error: "Inline styles are not allowed" };
  }

  const functionMatches = [...code.matchAll(/function\s+([A-Za-z0-9_]+)/g)];

  for (const match of functionMatches) {
    if (match[1] !== "GeneratedUI") {
      return {
        valid: false,
        error: "Only GeneratedUI component is allowed"
      };
    }
  }

  const importRegex = /import\s+.*from\s+['"](.*?)['"]/g;
  const matches = [...code.matchAll(importRegex)];

  for (let match of matches) {
    const importPath = match[1];
    if (!importPath.includes("./components")) {
      return { valid: false, error: "External imports are not allowed" };
    }
  }

  if (code.includes("className=")) {
    return { valid: false, error: "Custom classNames are not allowed" };
  }

  const componentRegex = /<([A-Z][A-Za-z0-9]*)/g;
  const componentMatches = [...code.matchAll(componentRegex)];

  for (let match of componentMatches) {
    const componentName = match[1];
    if (!ALLOWED_COMPONENTS.includes(componentName)) {
      return {
        valid: false,
        error: `Component ${componentName} is not allowed`
      };
    }
  }

  return { valid: true };
}

module.exports = validateCode;