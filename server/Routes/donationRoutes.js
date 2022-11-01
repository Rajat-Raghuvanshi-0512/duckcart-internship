const express = require("express");
const {
  donate,
  getAllDonations,
  MyDonations,
  getParticularDonations,
} = require("../Controller/donationController");
const { isAuthenticated } = require("../Middleware/auth");
const Router = express.Router();

Router.route("/donate").post(isAuthenticated, donate);
Router.route("/donations/all").get(isAuthenticated, getAllDonations);
Router.route("/donations/my").get(isAuthenticated, MyDonations);
Router.route("/donations/search").post(isAuthenticated, getParticularDonations);

module.exports = Router;
