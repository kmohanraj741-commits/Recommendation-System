const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || "v1";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const recommendations = [
  { id: 1, name: "Laptop", category: "Electronics", price: 50000, score: 95 },
  { id: 2, name: "Wireless Mouse", category: "Electronics", price: 500, score: 88 },
  { id: 3, name: "Keyboard", category: "Electronics", price: 1500, score: 84 },
  { id: 4, name: "Running Shoes", category: "Fashion", price: 2500, score: 91 },
  { id: 5, name: "Backpack", category: "Fashion", price: 1200, score: 79 },
  { id: 6, name: "Coffee Maker", category: "Home", price: 3200, score: 86 }
];

app.get("/health", (_req, res) => res.json({ status: "ok", version: VERSION }));
app.get("/api/recommendations", (_req, res) => res.json({ version: VERSION, recommendations }));
app.get("/api/recommendations/:id", (req, res) => {
  const item = recommendations.find(p => p.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Recommendation not found" });
  res.json(item);
});

app.listen(PORT, "0.0.0.0", () => console.log(`Recommendation System ${VERSION} running on port ${PORT}`));
