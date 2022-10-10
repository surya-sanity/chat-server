const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const socketio = require("socket.io")
const http = require("http")

const { errorHandler } = require("./middlewares/errorMiddleware");
const { handleNewSocketConnection } = require("./socket");

const userRouter = require("./routes/userRouter.js");

const app = express();
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

//testing api
app.get("/api", (req, res) => {
  res.send("🔥 Chat Server 🔥");
});

//routers
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 8080;

app.use(errorHandler);

io.on("connection", (socket) => { handleNewSocketConnection(socket, io) });

server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
})

