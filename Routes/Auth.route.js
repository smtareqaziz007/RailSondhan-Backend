const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/Auth.controller");
const verifyAccessToken = require("../helpers/jwt.helpers");

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh-token", AuthController.refreshToken);

router.delete("/logout", verifyAccessToken, AuthController.logout);

module.exports = router;
