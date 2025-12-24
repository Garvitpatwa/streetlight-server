const express = require("express");
const app = express();

app.use(express.json());

let deviceCommand = {}; // store last command

// DASHBOARD / POSTMAN SENDS COMMAND
app.post("/api/command", (req, res) => {
  const { deviceId, command } = req.body;
  if (!deviceId || !command) {
    return res.status(400).json({ success: false });
  }

  // Store numeric command
  if (command === "ON") deviceCommand[deviceId] = "1";
  else if (command === "OFF") deviceCommand[deviceId] = "0";

  console.log("COMMAND SET:", deviceId, deviceCommand[deviceId]);
  res.json({ success: true });
});

// ESP32 READS COMMAND (STICKY)
app.get("/api/command", (req, res) => {
  const id = req.query.deviceId;
  if (!id) return res.send("9");

  // return last command, default = 9
  res.send(deviceCommand[id] || "9");
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Streetlight server running");
});

// RENDER PORT FIX
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
