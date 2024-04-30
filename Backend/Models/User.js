const mongoose = require("mongoose");
const currentDate = new Date(); // Get current date and time
const day = String(currentDate.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Get month (zero-based index) and pad with leading zero if needed
const year = String(currentDate.getFullYear()).slice(-2);
const formattedDate = `${day}-${month}-${year}`;

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  color: { type: String, default: "red" },
  createdAt: {
    type: String,
    default: formattedDate,
  },
});
const todoItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  list: [
    {
      value: {
        type: String,
        default: "None",
      },
      color: {
        type: String,
        default: "black",
      },
    },
  ],
  type: [
    {
      value: {
        type: String,
        default: "Todo",
      },
      color: {
        type: String,
        default: "black",
      },
    },
  ],
  timeStamps: { type: String, required: true },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    default: formattedDate,
  },
  updatedAt: {
    type: String,
    default: formattedDate,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  todos: [todoItemSchema],
  lists: [listSchema],
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
