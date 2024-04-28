const express = require("express");
const router = express.Router();
const TaskModel = require("../Models/Todo.js");
const UserModel = require("../Models/User.js");
const Auth = require("../Middleware/Auth.js");

router.get("/todayTodo", Auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._conditions._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Sort todos array in descending order based on createdAt timestamp
    const sortedTodos = user.todos.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(sortedTodos);
  } catch (error) {
    console.error("Error retrieving today's todos:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("/addTodo", Auth, async (req, res) => {
  try {
    const { title, list, type, isCompleted } = req.body;
    const user = await UserModel.findById(req.user._conditions._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const newTodo = {
      title,
      list,
      type,
      isCompleted,
    };
    user.todos.push(newTodo);
    await user.save();
    res.status(200).json({ message: "Todo added successfully", todo: newTodo });
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).send("Internal server error");
  }
});

router.delete("/removeTodo/:id", Auth, async (req, res) => {
  try {
    const userId = req.user._conditions._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const todoIdToRemove = req.params.id;

    // Remove the todo from the todos array by updating the user document
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { todos: { _id: todoIdToRemove } } },
      { new: true }
    );

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
