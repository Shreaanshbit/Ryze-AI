const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const agentRoutes=require('./routes/agentRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api',agentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Ryze AI Backend Running" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}
    http://localhost:5000`);
});