const mongoose = require("mongoose");

const ConnectToMongoDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    if (connection) {
      console.log("Connected to Database 🏢");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = ConnectToMongoDb;
