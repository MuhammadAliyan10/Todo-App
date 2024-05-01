const express = require("express");
const router = express.Router();
const UserModel = require("../Models/User.js");
const Auth = require("../Middleware/Auth.js");

router.get("/todayTodo", Auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._conditions._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const sortedTodos = user.todos.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const todoToday = sortedTodos.filter(
      (todo) => todo["timeStamps"] === "Today"
    );
    res.status(200).json(todoToday);
  } catch (error) {
    console.error("Error retrieving today's todos:", error);
    res.status(500).send("Internal server error");
  }
});
router.get("/tomorrowTodo", Auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._conditions._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Sort todos array in descending order based on createdAt timestamp
    const sortedTodos = user.todos.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const todoToday = sortedTodos.filter(
      (todo) => todo["timeStamps"] === "Tomorrow"
    );
    res.status(200).json(todoToday);
  } catch (error) {
    console.error("Error retrieving today's todos:", error);
    res.status(500).send("Internal server error");
  }
});

router.patch("/updateCompleted/:taskID", Auth, async (req, res) => {
  try {
    const userId = req.user._conditions._id;
    const taskId = req.params.taskID;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const task = user.todos.find((todo) => todo._id.toString() == taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }
    task.isCompleted = req.body.isCompleted;
    await user.save();

    res.status(200).json({ message: "Todo updated successfully" });
    user.save();
  } catch (error) {
    console.error("Error retrieving today's todos:", error);
    res.status(500).send("Internal server error");
  }
});
router.get("/nextWeekTodo", Auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._conditions._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const sortedTodos = user.todos.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const todoToday = sortedTodos.filter(
      (todo) => todo["timeStamps"] === "nextWeek"
    );
    res.status(200).json(todoToday);
  } catch (error) {
    console.error("Error retrieving today's todos:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("/addTodo", Auth, async (req, res) => {
  try {
    const { title, list, type, timeStamps } = req.body;
    const user = await UserModel.findById(req.user._conditions._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const newTodo = {
      title,
      list,
      type,
      timeStamps,
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

router.post("/addList", Auth, async (req, res) => {
  try {
    const userId = req.user._conditions._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const { title, color } = req.body;

    const newList = {
      title,
      color,
    };
    const existingList = user.lists.find(
      (listItem) => listItem.title === newList.title
    );

    if (existingList) {
      return res
        .status(400)
        .json({ message: "List with this title already exists" });
    }
    user.lists.push(newList);
    user.save();
    res.status(200).json({ message: "List added successfully", list: newList });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send("Internal server error");
  }
});

//! Get all the list

router.get("/getLists", Auth, async (req, res) => {
  try {
    const id = req.user._conditions._id;
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const data = user.lists;
    res.json(data);
  } catch (error) {}
});

//! Delete a list

router.delete("/removeList/:listId", Auth, async (req, res) => {
  try {
    const id = req.user._conditions._id;
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const listId = req.params.listId;
    await UserModel.findByIdAndUpdate(
      id,
      { $pull: { lists: { _id: listId } } },
      { new: true }
    );
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
