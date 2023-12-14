const express = require("express");
const app = express();
const http = require("http");

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  io.emit("connection", "a new user connected"); // sends an event to ALL registered clients (sockets)
  socket.emit("welcome", "welcome new user"); // sends an event to ONLY the client who sent the server an event
  socket.broadcast.emit("new user", "a new client has connected to the server"); // sends an event to all clients EXCEPT the one who sent the server an event

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit('chat message', msg)
  });

  socket.on("set nickname", (nickname) => {
    console.log("nickname: " + nickname);
    io.emit('set nickname', nickname)
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
