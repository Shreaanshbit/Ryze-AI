export default function Card({ title = "Card", children }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        background: "#fff"
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ color: "#374151" }}>{children || "Content"}</div>
    </div>
  );
}