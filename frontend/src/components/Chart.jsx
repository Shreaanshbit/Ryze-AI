export default function Chart({ title = "Chart" }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        background: "#fff"
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 10 }}>{title}</div>
      <div
        style={{
          height: 120,
          borderRadius: 12,
          border: "1px dashed #d0d7de",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
          fontWeight: 600
        }}
      >
        Chart Preview
      </div>
    </div>
  );
}