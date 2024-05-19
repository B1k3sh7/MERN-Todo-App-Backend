import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/config.js";

dotenv.config({
  path: ".env",
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";

//routes declaration
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on port ${port}`);
  }
});

app.get("/", (req, res) => {
  res.send("Server is running successfully.");
  console.log("Secret");
});

connectDB();
