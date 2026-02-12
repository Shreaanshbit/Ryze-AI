export default function Button({ label = "Button", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #d0d7de",
        background: "#fff",
        cursor: "pointer",
        fontWeight: 600
      }}
    >
      {label}
    </button>
  );
}