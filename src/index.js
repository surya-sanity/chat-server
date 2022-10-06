const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const helmet = require("helmet");

const { errorHandler } = require("./middlewares/errorMiddleware");

const userRouter = require("./routes/userRouter.js");

const app = express();

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

app.listen(PORT, () => {
  console.log(`server is running on Port ${PORT}`);
});
