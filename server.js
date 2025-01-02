const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

const dataFilePath = "./stats.json";

// Middleware to parse JSON
app.use(express.json());

// Function to read stats from the JSON file
const readStats = () => {
  if (!fs.existsSync(dataFilePath)) {
    return { subscribers: 12345, visitors: 178910, lastUpdated: new Date() };
  }
  const data = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(data);
};

// Function to write stats to the JSON file
const writeStats = (stats) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(stats, null, 2), "utf8");
};

// Route to get stats
app.get("/api/stats", (req, res) => {
  const stats = readStats();
  res.json(stats);
});

// Route to update visitor count
app.post("/api/visit", (req, res) => {
  const stats = readStats();
  stats.visitors += 1;

  // Check if a week has passed to update subscribers
  const now = new Date();
  const lastUpdated = new Date(stats.lastUpdated);
  if ((now - lastUpdated) / (1000 * 60 * 60 * 24 * 7) >= 1) {
    stats.subscribers += 15;
    stats.lastUpdated = now;
  }

  writeStats(stats);
  res.json(stats);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
