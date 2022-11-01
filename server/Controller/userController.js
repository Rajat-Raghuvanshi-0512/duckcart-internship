const User = require("../Database/Models/userSchema");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const { saveToCookie } = require("../Utils/SaveToCookie");
const ApiFeatures = require("../Utils/ApiFeatures");
const ErrorHandler = require("../Utils/ErrorHandler");

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { username, password, cpassword, profession } = req.body;
  if (!username || !password || !cpassword || !profession) {
    return next(
      new ErrorHandler(
        400,
        "Please enter all the fields (username,password,cpassword,profession)"
      )
    );
  }
  if (password.length < 6) {
    return next(
      new ErrorHandler(400, "Password should be atleast 6 characters")
    );
  }
  const user = await User.findOne({ username });
  if (user) {
    return next(new ErrorHandler(400, "Username is already taken"));
  }
  if (password !== cpassword) {
    return next(new ErrorHandler(400, "Passwords donot match"));
  }
  const newUser = await User.create({ username, password, profession });
  if (!newUser) {
    return next(new ErrorHandler(400, "Error creating new user"));
  }
  saveToCookie(newUser, 201, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(
      new ErrorHandler(400, "Please enter all the fields (username,password)")
    );
  }
  const user = await User.findOne({ username });
  if (!user) {
    return next(new ErrorHandler(400, "Incorrect username or password"));
  }
  const isAuthenticated = await user.matchPassword(password);
  if (!isAuthenticated) {
    return next(new ErrorHandler(400, "Incorrect username or password"));
  }
  saveToCookie(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res.status(200).json({ message: "Successfully logged out!" });
});

exports.updateCreator = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler(400, "User doesnot exist"));
  }
  const isTaken = await User.findOne({ username: req.body.username });
  if (isTaken) {
    return next(new ErrorHandler(400, "Username already taken"));
  }
  await user.updateOne(req.body);

  return res
    .status(200)
    .json({ success: true, message: "Creator updated successfully" });
});

exports.deleteCreator = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }
  await User.deleteOne(user);
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res
    .status(200)
    .json({ success: true, message: "Creator deleted successfully" });
});

exports.getAllCreators = catchAsyncErrors(async (req, res, next) => {
  const ResultsPerPage = 2;
  const NumberOfDocuments = await User.countDocuments();

  const apifeatures = new ApiFeatures(User.find(), req.query).search().filter();
  let data = await apifeatures.query;

  const filteredProductsCount = data.length;
  apifeatures.page(ResultsPerPage);

  data = await apifeatures.query.clone();
  if (!data) {
    return next(new ErrorHandler(400, "Failed to fetch data"));
  }
  return res.status(200).json({
    success: true,
    data,
    NumberOfDocuments,
    ResultsPerPage,
    filteredProductsCount,
  });
});
