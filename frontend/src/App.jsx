import { useEffect, useMemo, useState } from "react";
import PreviewRenderer from "./preview/PreviewRenderer";
import { generateUI, getVersions, rollback } from "./api/client";
import "./App.css";

function parseCodeToUiPlan(code) {
  const allowed = ["Button", "Card", "Input", "Modal", "Sidebar", "Navbar", "Table", "Chart"];
  const tagRegex = /<\s*(Button|Card|Input|Modal|Sidebar|Navbar|Table|Chart)\b([^\/>]*)\/\s*>/g;

  const getProp = (attrs, key) => {
    const r = new RegExp(`${key}\\s*=\\s*"([^"]*)"`, "i");
    const m = attrs.match(r);
    return m ? m[1] : undefined;
  };

  const components = [];
  let match;

  while ((match = tagRegex.exec(code || "")) !== null) {
    const type = match[1];
    const attrs = match[2] || "";
    if (!allowed.includes(type)) continue;

    const props = {};
    const title = getProp(attrs, "title");
    const label = getProp(attrs, "label");
    const placeholder = getProp(attrs, "placeholder");

    if (title !== undefined) props.title = title;
    if (label !== undefined) props.label = label;
    if (placeholder !== undefined) props.placeholder = placeholder;

    components.push(Object.keys(props).length ? { type, props } : { type });
  }

  return { layout: "single-column", components };
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [uiPlan, setUiPlan] = useState(null);

  const [versions, setVersions] = useState([]);
  const [copied, setCopied] = useState(false);

  const [previewMode, setPreviewMode] = useState("plan"); // "plan" | "code"
  const [codeParseError, setCodeParseError] = useState("");

  async function refreshVersions() {
    const data = await getVersions();
    if (data?.success) setVersions(data.versions || []);
  }

  useEffect(() => {
    refreshVersions();
  }, []);

  const codeUiPlan = useMemo(() => {
    if (previewMode !== "code") return null;
    try {
      const p = parseCodeToUiPlan(code || "");
      const has = Array.isArray(p.components) && p.components.length > 0;
      setCodeParseError(has ? "" : "No valid components found. Use self-closing tags like <Card title=\"...\" />");
      return p;
    } catch {
      setCodeParseError("Could not parse the code into a preview.");
      return { layout: "single-column", components: [] };
    }
  }, [code, previewMode]);

  const activeUiPlan = previewMode === "code" ? codeUiPlan : uiPlan;

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

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="logo-container">
            <div className="logo-icon">
              <span className="sparkle">✨</span>
            </div>
            <h1 className="app-title">Ryze AI</h1>
          </div>
          <div className="tagline">UI Builder</div>
        </div>
        <div className="top-bar-right">
          <div className="status-badge">
            <span className="status-dot"></span>
            Connected
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <div className="panel-section">
            <div className="section-header">
              <span className="section-icon">💬</span>
              <h2 className="section-title">Prompt</h2>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your UI design... 
e.g., 'Create a modern dashboard with charts and cards'"
              className="prompt-textarea"
              disabled={loading}
            />
            <button
              onClick={onGenerate}
              disabled={loading}
              className={`generate-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  <span className="button-icon">🚀</span>
                  Generate / Modify
                </>
              )}
            </button>
          </div>

          <div className="panel-section versions-section">
            <div className="section-header">
              <span className="section-icon">📚</span>
              <h2 className="section-title">Versions</h2>
              <span className="version-count">{versions.length}</span>
            </div>
            <div className="versions-list">
              {versions
                .slice()
                .reverse()
                .map((v, idx) => (
                  <button key={v.id} onClick={() => onRollback(v.id)} className="version-card">
                    <div className="version-header">
                      <span className="version-badge">v{v.id}</span>
                      {idx === 0 && <span className="latest-badge">Latest</span>}
                    </div>
                    <div className="version-description">
                      {(v.explanation || "").slice(0, 60)}
                      {(v.explanation || "").length > 60 ? "..." : ""}
                    </div>
                  </button>
                ))}
              {!versions.length && (
                <div className="empty-state">
                  <span className="empty-icon">📭</span>
                  <p>No versions yet</p>
                  <p className="empty-subtext">Generate your first UI to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="middle-panel">
          <div className="preview-container">
            <div className="section-header">
              <span className="section-icon">👁️</span>
              <h2 className="section-title">Live Preview</h2>

              <div className="preview-mode-toggle" style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setPreviewMode("plan")}
                  className={`copy-button ${previewMode === "plan" ? "copied" : ""}`}
                  style={{ padding: "6px 10px" }}
                >
                  Plan
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("code")}
                  className={`copy-button ${previewMode === "code" ? "copied" : ""}`}
                  style={{ padding: "6px 10px" }}
                >
                  Code
                </button>
              </div>
            </div>

            <div className="preview-viewport">
              {previewMode === "code" && codeParseError ? (
                <div style={{ color: "#b91c1c", fontWeight: 600, marginBottom: 10 }}>{codeParseError}</div>
              ) : null}

              {activeUiPlan ? (
                <PreviewRenderer uiPlan={activeUiPlan} />
              ) : (
                <div className="empty-state">
                  <div className="empty-preview-graphic">
                    <div className="graphic-circle"></div>
                    <div className="graphic-square"></div>
                    <div className="graphic-triangle"></div>
                  </div>
                  <p>Your UI preview will appear here</p>
                  <p className="empty-subtext">Start by describing your design</p>
                </div>
              )}
            </div>
          </div>

          <div className="explanation-container">
            <div className="section-header">
              <span className="section-icon">💡</span>
              <h2 className="section-title">Explanation</h2>
            </div>
            <div className="explanation-content">
              {explanation ? (
                <div className="explanation-text">{explanation}</div>
              ) : (
                <div className="empty-state-small">
                  <span>No explanation yet</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="section-header code-header">
            <div className="header-left">
              <span className="section-icon">⚡</span>
              <h2 className="section-title">Generated Code</h2>
            </div>
            <button onClick={copyCode} className={`copy-button ${copied ? "copied" : ""}`}>
              {copied ? (
                <>
                  <span>✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <span>📋</span>
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="code-editor-container">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Generated code will appear here...
// Start by creating your first UI design"
              className="code-editor"
            />
          </div>
        </div>
      </div>
    </div>
  );
}