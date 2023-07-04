const authRouter = require("express").Router();
const auth = require("../controller/Auth.controller");

authRouter.route("/signup").post(auth.signup);
authRouter.route("/login").post(auth.login);

module.exports = {
  authRouter,
};
