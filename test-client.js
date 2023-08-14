const io = require("socket.io-client");

const serverUrl = "https://random-server-05tv.onrender.com"; // Update with your server URL
const socket = io(serverUrl);

// Event listener for connection success
socket.on("connect", () => {
  console.log("Connected to server");

  // Emit a test event to the server
  socket.emit("test-response", "Hello from client");
});

// Event listener for receiving a response from the server
socket.on("test-response1", (data) => {
  console.log("Received response from server:", data);
});

// Event listener for disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
