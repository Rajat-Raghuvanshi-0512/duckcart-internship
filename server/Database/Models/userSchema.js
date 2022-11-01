const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minLength: [3, "username must be atleast 3 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be atleast 6 characters"],
  },
  profession: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
      default: "default",
    },
    url: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/rajat0512/image/upload/v1642447946/E-commerce/avatar_gehm7u.jpg",
    },
  },
  role: {
    type: String,
    default: "creator",
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  } catch (err) {
    console.log(err);
  }
});

// JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare password
userSchema.methods.matchPassword = async function (pass) {
  try {
    return await bcrypt.compare(pass, this.password);
  } catch (err) {
    console.log(err);
  }
};

// Generating password reset token
userSchema.methods.ResetPassword = function (phone) {
  // Generating token
  let token;
  if (phone) {
    const otp = generateOTP();
    token = otp;
  } else {
    token = crypto.randomBytes(20).toString("hex");
  }

  // Hashing and adding token to USER
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Setting the password expire time to 5 mins
  this.passwordExpire = Date.now() + 5 * 60 * 1000;

  return token;
};

module.exports = mongoose.model("user", userSchema);
