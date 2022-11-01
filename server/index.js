const App = require("./App");
const ConnectToMongoDb = require("./Database/connectToDB");
require("dotenv").config();

ConnectToMongoDb();
const PORT = process.env.PORT || 3001;

App.get("/", (_, res) => {
  res.send("Server is up and running 🤎");
});

App.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT} 🔥`)
);
