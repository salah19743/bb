var express = require("express");
var { createServer } = require("http");
var { Server } = require("socket.io");
var app = express();
var server = createServer(app);
var io = new Server(server);
var port = process.env.PORT || 3000;
var lobby = [];
var ips = [];

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/assets", express.static("./assets"));

app.get("/", (req, res) => {
  res.render("menu", { content: "index" });
});

app.get("/about-us", (req, res) => {
  res.render("menu", { content: "aboutUs" });
});

app.get("/contact-us", (req, res) => {
  res.render("menu", { content: "contactUs" });
});

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

io.on("connection", (socket) => {
  var ip = socket.handshake.headers["x-forwarded-for"].split(",")[0];
  console.log(ip);
  if (!ips.includes(ip)) {
    ips.push(ip);
  }
  socket.emit("users", ips.length);

  socket.on("newChat", () => {
    lobby = lobby.filter((id) => id !== socket.id);
    var room = Array.from(socket.rooms)[1];
    if (room) {
      socket.broadcast.to(room).emit("disconnected");
      socket.leave(room);
    }
    if (lobby.length > 0) {
      var stranger = io.sockets.sockets.get(lobby[rnd(0, lobby.length - 1)]);
      var room = socket.id + stranger.id;
      socket.join(room);
      stranger.join(room);
      io.to(room).emit("paired");
      lobby = lobby.filter((id) => id !== stranger.id);
    } else {
      lobby = lobby.filter((id) => id !== socket.id);
      lobby.push(socket.id);
    }
  });

  socket.on("sendMsg", (msg) => {
    var room = Array.from(socket.rooms)[1];
    if (room) {
      socket.broadcast.to(room).emit("newMsg", msg);
    }
  });

  socket.on("disconnecting", () => {
    var room = Array.from(socket.rooms)[1];
    if (room) {
      socket.broadcast.to(room).emit("disconnected");
    }
    lobby = lobby.filter((id) => id !== socket.id);
    var socketIp = socket.handshake.headers["x-forwarded-for"].split(",")[0];
    ips = ips.filter((ip) => ip !== socketIp);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
