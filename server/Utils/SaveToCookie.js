exports.saveToCookie = async (user, statusCode, res) => {
  const token = await user.getJwtToken();
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };
  const { password, ...responseUser } = user._doc;
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ user: responseUser, token });
};
