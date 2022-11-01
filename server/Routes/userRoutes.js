const express = require("express");
const {
  login,
  register,
  logout,
  getAllCreators,
  updateCreator,
  deleteCreator,
} = require("../Controller/userController");
const { isAuthenticated } = require("../Middleware/auth");
const Router = express.Router();

Router.route("/login").post(login);
Router.route("/register").post(register);
Router.route("/logout").get(logout);

Router.route("/creators").get(isAuthenticated, getAllCreators);
Router.route("/update/me").put(isAuthenticated, updateCreator);
Router.route("/delete/me").delete(isAuthenticated, deleteCreator);

module.exports = Router;
