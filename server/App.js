const express = require("express");
const App = express();
const handleError = require("./Middleware/error");
const cookieParser = require("cookie-parser");
const User = require("./Routes/userRoutes");
const Donate = require("./Routes/donationRoutes");
require("dotenv").config();

App.use(cookieParser());
App.use(express.json());

App.use("/api", User);
App.use("/api", Donate);

App.use(handleError);

module.exports = App;
