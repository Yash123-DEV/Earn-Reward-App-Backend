"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { registerUser, loginUser, getUserCoins } = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.get("/", function (req, res) {
    res.send("works Fine");
});
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/api/user/coins", getUserCoins);
module.exports = router;
