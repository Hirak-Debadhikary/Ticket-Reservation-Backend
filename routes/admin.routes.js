const adminRouter = require("express").Router();
const admin = require("../controller/Admin.controller");

adminRouter.route("/signup").post(admin.adminSignup);
adminRouter.route("/login").post(admin.adminLogin);
adminRouter.route("/getAllAdmin").get(admin.getAllAdmins);

module.exports = {
  adminRouter,
};
