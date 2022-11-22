const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const userRouter = require("./routes/user");
const ticketRouter = require("./routes/ticket");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
app.use(helmet());
app.use(cors());

app.use(express.json());

const handleError = require("./utils/errorHandler");

//db connection
mongoose.connect(process.env.MONGO_URI);

if (process.env.NODE_ENV !== "production") {
  const mdb = mongoose.connection;
  mdb.on("open", () => console.log("MongoDB is connected"));
  mdb.on("error", (error) => console.log(error));

  app.use(morgan("tiny"));
}

//routes
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

//MongoDB Connection Setup

app.use("*", (req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
