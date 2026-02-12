// src/App.jsx
import { useEffect, useState } from "react";
import PreviewRenderer from "./preview/PreviewRenderer";
import { generateUI, getVersions, rollback } from "./api/client";
import "./App.css";

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
    <div className="app-container">
      {/* Left Panel - Prompt & Versions */}
      <div className="left-panel">
        <div className="app-title">Ryze AI UI Builder</div>

        <div className="prompt-section">
          <label className="section-label">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe UI or request modifications..."
            className="prompt-textarea"
          />
          <button
            onClick={onGenerate}
            disabled={loading}
            className={`generate-button ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Generating...
              </>
            ) : (
              "Generate / Modify"
            )}
          </button>
        </div>

        <div className="versions-section">
          <div className="section-label">Versions</div>
          <div className="versions-list">
            {versions.slice().reverse().map((v) => (
              <button
                key={v.id}
                onClick={() => onRollback(v.id)}
                className="version-card"
              >
                <div className="version-id">Version {v.id}</div>
                <div className="version-snippet">
                  {(v.explanation || "").slice(0, 60)}
                  {(v.explanation || "").length > 60 ? "..." : ""}
                </div>
              </button>
            ))}
            {!versions.length && (
              <div className="empty-state">No versions yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Panel - Preview & Explanation */}
      <div className="middle-panel">
        <div className="preview-container">
          <h2 className="panel-title">Live Preview</h2>
          <div className="preview-content">
            <PreviewRenderer uiPlan={uiPlan} />
          </div>
        </div>

        <div className="explanation-container">
          <h2 className="panel-title">Explanation</h2>
          <div className="explanation-content">
            {explanation || "No explanation yet."}
          </div>
        </div>
      </div>

      {/* Right Panel - Code */}
      <div className="right-panel">
        <h2 className="panel-title">Generated Code</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Generated code will appear here..."
          className="code-textarea"
        />
      </div>
    </div>
  );
}