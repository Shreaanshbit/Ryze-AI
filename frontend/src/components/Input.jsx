export default function Input({ label = "Label", placeholder = "Type here..." }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <input
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #d0d7de",
          outline: "none"
        }}
      />
    </label>
  );
}