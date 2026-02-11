let versions = [];
let currentVersion = -1;

function saveVersion(code, explanation) {
  const newVersion = {
    id: versions.length,
    code,
    explanation,
  };

  versions.push(newVersion);
  currentVersion = newVersion.id;

  return newVersion;
}

function getVersions() {
  return versions;
}

function getCurrentVersion() {
  return versions[currentVersion] || null;
}

function rollback(versionId) {
  const version = versions.find((v) => v.id === versionId);
  if (!version) return null;

  currentVersion = versionId;
  return version;
}

module.exports = {
  saveVersion,
  getVersions,
  getCurrentVersion,
  rollback,
};