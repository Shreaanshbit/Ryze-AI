import { useEffect, useState } from "react";
import PreviewRenderer from "./preview/PreviewRenderer";
import { generateUI, getVersions, rollback } from "./api/client";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [uiPlan, setUiPlan] = useState(null);

  const [versions, setVersions] = useState([]);

  async function refreshVersions() {
    const data = await getVersions();
    if (data?.success) setVersions(data.versions || []);
  }

  useEffect(() => {
    refreshVersions();
  }, []);

  async function onGenerate() {
    const text = prompt.trim();
    if (!text) return;

    setLoading(true);
    const data = await generateUI(text);
    setLoading(false);

    if (!data.success) {
      setExplanation(data.error || "Generation failed");
      return;
    }

    setCode(data.code || "");
    setExplanation(data.explanation || "");
    setUiPlan(data.uiPlan || null);
    setPrompt("");
    refreshVersions();
  }

  async function onRollback(id) {
    const data = await rollback(id);
    if (!data.success) return;

    setCode(data.version.code || "");
    setExplanation(data.version.explanation || "");
    setUiPlan(data.version.uiPlan || null);
    refreshVersions();
  }

  return (
    <div style={{ height: "100vh", display: "grid", gridTemplateColumns: "340px 1fr 520px" }}>
      <div style={{ borderRight: "1px solid #e5e7eb", padding: 14, display: "grid", gridTemplateRows: "auto auto 1fr" }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Ryze AI</div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Prompt</div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe UI or request modifications..."
            style={{ width: "100%", minHeight: 90, resize: "vertical", padding: 10, borderRadius: 10, border: "1px solid #d0d7de" }}
          />
          <button
            onClick={onGenerate}
            disabled={loading}
            style={{ marginTop: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d0d7de", background: "#fff", fontWeight: 800, cursor: "pointer" }}
          >
            {loading ? "Generating..." : "Generate / Modify"}
          </button>
        </div>

        <div style={{ marginTop: 14, overflow: "auto" }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Versions</div>
          <div style={{ display: "grid", gap: 8 }}>
            {versions.slice().reverse().map((v) => (
              <button
                key={v.id}
                onClick={() => onRollback(v.id)}
                style={{ textAlign: "left", padding: 10, borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}
              >
                <div style={{ fontWeight: 800 }}>Version {v.id}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  {(v.explanation || "").slice(0, 60)}{(v.explanation || "").length > 60 ? "..." : ""}
                </div>
              </button>
            ))}
            {!versions.length ? <div style={{ color: "#6b7280" }}>No versions yet</div> : null}
          </div>
        </div>
      </div>

      <div style={{ padding: 14, overflow: "auto" }}>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Live Preview</div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "#f9fafb" }}>
          <PreviewRenderer uiPlan={uiPlan} />
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Explanation</div>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "#fff", whiteSpace: "pre-wrap" }}>
            {explanation || "No explanation yet."}
          </div>
        </div>
      </div>

      <div style={{ borderLeft: "1px solid #e5e7eb", padding: 14, overflow: "auto" }}>
        <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>Generated Code</div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Generated code will appear here..."
          style={{ width: "100%", height: "calc(100vh - 60px)", resize: "none", padding: 12, borderRadius: 14, border: "1px solid #d0d7de", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 12 }}
        />
      </div>
    </div>
  );
}