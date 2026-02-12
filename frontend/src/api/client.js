const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function generateUI(userInput) {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userInput })
  });
  return await res.json();
}

export async function getVersions() {
  const res = await fetch(`${API_BASE}/api/versions`);
  return await res.json();
}

export async function rollback(versionId) {
  const res = await fetch(`${API_BASE}/api/rollback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ versionId })
  });
  return await res.json();
}