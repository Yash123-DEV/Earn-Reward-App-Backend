import express, { Request, Response } from 'express';
const {registerUser, loginUser,getUserCoins} = require("../controllers/auth.controller")

const router = express.Router();

router.get("/" , function(req, res) {
   res.send("works Fine");
})

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/api/user/coins", getUserCoins);

module.exports = router;
