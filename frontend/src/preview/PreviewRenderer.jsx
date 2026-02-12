import { Button, Card, Input, Modal, Sidebar, Navbar, Table, Chart } from "../components";

const MAP = { Button, Card, Input, Modal, Sidebar, Navbar, Table, Chart };

export default function PreviewRenderer({ uiPlan }) {
  if (!uiPlan || !Array.isArray(uiPlan.components)) {
    return <div style={{ color: "#6b7280" }}>Preview will appear here after generation.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {uiPlan.components.map((c, idx) => {
        const Comp = MAP[c.type];
        if (!Comp) return null;
        return <Comp key={`${c.type}-${idx}`} {...(c.props || {})} />;
      })}
    </div>
  );
}