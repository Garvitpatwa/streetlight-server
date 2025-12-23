const express = require("express");
const app = express();

// middleware
app.use(express.json());

// in-memory storage
let deviceData = {};
let deviceCommand = {};

// receive data from ESP32
app.post("/api/data", (req, res) => {
  const d = req.body;
  if (!d.deviceId) {
    return res.status(400).json({ error: "deviceId missing" });
  }
  deviceData[d.deviceId] = d;
  res.json({ success: true });
});

// ESP32 asks for command
app.get("/api/command", (req, res) => {
  const id = req.query.deviceId;
  if (!id) return res.send("NONE");

  const cmd = deviceCommand[id] || "NONE";
  deviceCommand[id] = "NONE"; // clear after read
  res.send(cmd);
});

// dashboard sets command
app.post("/api/command", (req, res) => {
  const { deviceId, command } = req.body;
  if (!deviceId || !command) {
    return res.status(400).json({ success: false });
  }
  deviceCommand[deviceId] = command;
  res.json({ success: true });
});

// test route
app.get("/", (req, res) => {
  res.send("Streetlight server running");
});

// 🔥 REQUIRED PORT FIX FOR RENDER 🔥
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
