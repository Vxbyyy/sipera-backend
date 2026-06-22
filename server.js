require("dotenv").config();
const app = require("./app");
const db = require("./config/database");

db.sync({ alter: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});