const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const express = require("express");
const cors = require("cors");

let mainWindow;

// ✅ Create Express server inside Electron
const server = express();
server.use(express.json()); // Enable JSON parsing
server.use(cors()); // Enable CORS

// ✅ API to show the Electron pop-up after login
server.post("/login-success", (req, res) => {
  console.log("✅ [Electron] Received login-success:", req.body);

  if (!mainWindow) {
    createMainWindow();
  }

  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }

  mainWindow.focus(); // Ensure it's focused
  res.json({ status: "success" });
});

// ✅ Start Express on port 5000
server.listen(5000, () => {
  console.log("✅ [Electron] Listening for login events on port 5000");
});

// ✅ Function to create the Electron window (hidden initially)
function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 290,
    height: 90,
    x: width - 300, // Lower right corner
    y: height - 130,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    show: false, // ✅ Start hidden
    skipTaskbar: true, // ✅ Prevents showing in taskbar
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html")); // ✅ Load UI only once

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide(); // Hide instead of closing
  });

  console.log("✅ Electron is running, waiting for login event...");
}

// ✅ Initialize Electron
app.whenReady().then(() => {
  createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
