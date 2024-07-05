const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const errorHandler = require("./Middleware/errorMiddleware");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http")

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,  // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

app.use(cors(corsOptions));
app.use(express.json()); //to parse the data posted; the data will be recieved in req.body
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8000;

app.use("/api/users", require("./Routes/UserRoutes"));
app.use(
  "/api/chat",
  (req, res, next) => {
    req.io = io;
    next();
  },
  require("./Routes/ChatRoutes")
);

app.use(express.static(path.join(__dirname, `uploads`)));
connectDB();

let users = {}
console.log(users)
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on('user_connected', (username) => {
    console.log(username)
    users[username] = socket.id;
    console.log(users)
    io.emit('update_user_list', Object.keys(users));
  });

  socket.on('check_user_status', (username) => {
    const userSocketId = users[username];
    const status = userSocketId ? 'online' : 'offline';
    socket.emit('user_status', { username, status });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    for (const username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
    io.emit('update_user_list', Object.keys(users));
  });
});

server.listen(PORT, () => {
  console.log(`Server Started`);
});
