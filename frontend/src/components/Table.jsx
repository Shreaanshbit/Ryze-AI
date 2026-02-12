export default function Table({ title = "Table" }) {
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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>Name</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #e5e7eb" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>Item A</td>
            <td style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>123</td>
          </tr>
          <tr>
            <td style={{ padding: 8 }}>Item B</td>
            <td style={{ padding: 8 }}>456</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}