const express = require("express");
const app = express();

app.use(express.json());

let deviceCommand = {}; // store last command

// ================= POST: DASHBOARD / POSTMAN =================
app.post("/api/command", (req, res) => {
  const { deviceId, command } = req.body;

  if (!deviceId || !command) {
    return res.status(400).json({ success: false });
  }

  if (command === "ON") deviceCommand[deviceId] = "1";
  else if (command === "OFF") deviceCommand[deviceId] = "0";

  console.log("COMMAND SET:", deviceId, deviceCommand[deviceId]);

  res.json({ success: true });
});

// ================= GET: ESP32 (EC200U SAFE) =================
app.get("/api/command", (req, res) => {
  const id = req.query.deviceId;
  const cmd = deviceCommand[id] || "9";

  // 🔴 VERY IMPORTANT FOR EC200U
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Length", "1");
  res.setHeader("Connection", "close");

  res.status(200).send(cmd);
});

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Streetlight server running");
});

// ================= RENDER PORT =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
