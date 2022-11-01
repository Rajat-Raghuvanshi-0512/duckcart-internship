const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  message: {
    type: String,
    minLength: [6, "Message must be atleast 5 characters"],
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("donation", donationSchema);
