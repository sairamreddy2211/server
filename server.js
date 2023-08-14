const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const rooms = {};

const PORT = process.env.PORT || 8000;

app.get("/user", function (req, res) {
  console.log("/user request called");
  res.send("Welcome to GeeksforGeeks");
});

io.on("connection", (socket) => {
  /*
        If a peer is initiator, he will create a new room
        otherwise if peer is receiver he will join the room
    */
  console.log("join room", socket.id);

  socket.on("test-response", (roomID) => {
    console.log(roomID);
    socket.emit("test-response1", roomID);
  });

  socket.on("join_room", (roomID) => {
    console.log("join room", socket.id);
    if (rooms[roomID]) {
      // Receiving peer joins the room
      rooms[roomID].push(socket.id);
    } else {
      // Initiating peer create a new room
      rooms[roomID] = [socket.id];
    }

    /*
            If both initiating and receiving peer joins the room,
            we will get the other user details.

            For initiating peer it would be receiving peer and vice versa.
        */
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      console.log("other user", otherUser);
      console.log("cuurent user id ", socket.id);
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  /*
        The initiating peer offers a connection
    */
  socket.on("offer", (payload) => {
    console.log("on offer payload", payload);
    io.to(payload.target).emit("offer", payload);
  });

  /*
        The receiving peer answers (accepts) the offer
    */
  socket.on("answer", (payload) => {
    console.log("on answer payload", payload);

    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    console.log("on ice-candidate incoming", incoming);

    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});

server.listen(PORT, (e) => {
  console.log("Server is up and running on Port 8000");
});
