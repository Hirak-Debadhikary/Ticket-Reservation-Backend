const authRouter = require("express").Router();
const auth = require("../controller/Auth.controller");

authRouter.route("/signup").post(auth.signup);
authRouter.route("/login").post(auth.login);
authRouter.route("/getallusers").get(auth.getAllUsers);
authRouter.route("/:id").put(auth.updateUser);
authRouter.route("/:id").delete(auth.deleteUser);
authRouter.route("/bookings/:id").get(auth.getBookingsOfUser);

module.exports = {
  authRouter,
};
