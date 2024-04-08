const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello");
  res.end();
});

// const corsOptions = {
//     origin: ["http://localhost:5173", "backend-chat-8kuyk5syg-kaiques-projects-6454db41.vercel.app","https://backend-chat-app-git-main-kaiques-projects-6454db41.vercel.app/"]
// }

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods:["GET", "POST"]
  },
});


io.on("connection", (socket) => {
  socket.on("test", (data) => {
    console.log(data);
  });

  socket.on("createUser_joinRoom", ({ user, room }) => {
    socket.join(room);

    socket.emit("receiveMessage", {
      message: `Welcome to ${room}, ${user}`,
      admin: true,
      time: new Intl.DateTimeFormat("default", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date()),
    });

    socket.broadcast.emit("receiveMessage", {
      message: `${user} joined room`,
      admin: true,
      time: new Intl.DateTimeFormat("default", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date()),
    });

    socket.on("sendMessage", ({ message }) => {
      console.log(`From:${user} \nMessage:${message}\n Room: ${room}`);
      socket.broadcast.emit("receiveMessage", {
        message,
        user,
        room,
        currentUser: false,
      });
      socket.emit("receiveMessage", { message, user, room, currentUser: true });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running in PORT ${PORT}`);
});
