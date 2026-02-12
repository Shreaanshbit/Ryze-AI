export default function Navbar({ title = "Navbar", children }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        background: "#fff"
      }}
    >
      <div style={{ fontWeight: 800 }}>{title}</div>
      {children ? <div style={{ marginTop: 8 }}>{children}</div> : null}
    </div>
  );
}