const donationSchema = require("../Database/Models/donationSchema");
const userSchema = require("../Database/Models/userSchema");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");

exports.donate = catchAsyncErrors(async (req, res, next) => {
  const from = req.user.id;
  const { to, currency, amount, name, message } = req.body;
  if (!to || !currency || !amount) {
    return next(new ErrorHandler(400, "Please fill all the required fields"));
  }
  const creator = await userSchema.findOne({ username: to });
  if (!creator) {
    return next(new ErrorHandler(400, "No user with such name exists"));
  }
  const donationReceipt = await donationSchema.create({
    from,
    to: creator.id,
    amount,
    name,
    message,
    currency,
  });
  if (!donationReceipt) {
    return next(new ErrorHandler(400, "Error in transfering funds"));
  }
  return res.status(200).json({ success: true, donationReceipt });
});

exports.getAllDonations = catchAsyncErrors(async (req, res, next) => {
  const donations = await donationSchema.find().populate("to from");
  return res.status(200).json({ success: true, donations });
});

exports.MyDonations = catchAsyncErrors(async (req, res, next) => {
  const mydonations = await donationSchema
    .find({ from: req.user.id })
    .populate("to from");
  return res.status(200).json({ success: true, mydonations });
});

exports.getParticularDonations = catchAsyncErrors(async (req, res, next) => {
  const { from, to } = req.body;
  if (!from || !to) {
    return next(new ErrorHandler(400, "Please specify both users"));
  }
  const user1 = await userSchema.findOne({ username: from });
  const user2 = await userSchema.findOne({ username: to });
  const donations = await donationSchema
    .find({ from: user1.id, to: user2.id })
    .populate("to from");
  return res.status(200).json({ success: true, donations });
});
