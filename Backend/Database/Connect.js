const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/todo_app")
  .then(() => console.log("Connection to database is successful"))
  .catch((err) => {
    console.log(err);
  });
