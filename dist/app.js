"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors = require("cors");
const userRouter = require("./routes/userRouter");
app.use(express_1.default.json()); // Parses incoming JSON requests
app.use(express_1.default.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors({
    origin: `http://localhost:3000`, // Frontend's URL
    credentials: true, // Allow cookies and credentials
}));
app.use("/users", userRouter);
app.get("/", function (req, res) {
    res.send("works");
});
app.listen(5000, function () {
    console.log(`Server is running on http://localhost:5000`);
});
// import express, { Request, Response } from "express";
// const app = express();
// const cors = require("cors");
// const userRouter = require("./routes/userRouter")
// const location = 'http://192.168.146.187';
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.use(cors({
//    origin: `http://${location}:3000`, // Frontend's URL
//    credentials: true, // Allow cookies and credentials
// }));
// console.log(location);
// app.use("/users", userRouter);
// app.get("/", function(req: Request, res: Response) {
//    res.send("works");
// })
// app.listen(5000, '0.0.0.0', function () {
//    console.log(`Server is running on http://0.0.0.0:5000`);
// });
