function generateImports() {
  return `import { Button, Card, Input, Modal, Sidebar, Navbar, Table, Chart } from "./components";`;
}

function generateComponentJSX(plan) {
  const elements = plan.components.map((component) => {
    const { type, props } = component;

    if (props && props.title) {
      return `<${type} title="${props.title}" />`;
    }

    return `<${type} />`;
  });

  return elements.join("\n      ");
}

function generator(plan) {
  if (!plan || !plan.components) {
    throw new Error("Invalid plan");
  }

  const imports = generateImports();
  const jsx = generateComponentJSX(plan);

  const code = `
${imports}

export default function GeneratedUI() {
  return (
    <>
      ${jsx}
    </>
  );
}
  `.trim();

  return code;
}

module.exports = generator;