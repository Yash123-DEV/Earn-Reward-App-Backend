import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const  FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();
const userRouter = require("./routes/userRouter");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.set("view engine", "ejs");

app.use(
  cors({
    origin : FRONTEND_URL,
    credentials: true, 
  })
);

app.use("/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("works");
});

app.listen(5000);
