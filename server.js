require("dotenv").config();

const app = require("./app");
const db = require("./config/database");

const PORT = process.env.PORT || 5000;

db.authenticate()
.then(() => {
   console.log("Database connected");

   app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
   });
})
  .catch((err) => {
    console.log(
      "Database connection failed:",
      err
    );
  });