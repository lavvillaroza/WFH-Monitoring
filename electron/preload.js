const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ Preload script is running!"); // Add this for debugging

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, callback) =>
      ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  },
});
