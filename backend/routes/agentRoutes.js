const express = require("express");
const orchestrator = require("../agent/orchestrator");
const { rollback, getVersions } = require("../store/versionStore");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { userInput } = req.body;

    const result = await orchestrator(userInput);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/rollback", (req, res) => {
  const { versionId } = req.body;

  const version = rollback(versionId);

  if (!version) {
    return res.status(404).json({
      success: false,
      error: "Version not found"
    });
  }

  res.json({
    success: true,
    version
  });
});

router.get("/versions", (req, res) => {
  res.json({
    success: true,
    versions: getVersions()
  });
});

module.exports = router;