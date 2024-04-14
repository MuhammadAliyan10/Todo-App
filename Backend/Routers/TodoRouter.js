const express = require('express')
const router = express.Router()
const TaskModel = require('../Models/Todo.js')
const UserModel = require('../Models/User.js')



router.post('/todayTodo', async (req, res) => {


    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'User not logged in' });
        } const userLog = await UserModel.findOne({ email: email });
        if (!userLog) {
            return res.status(404).json({ message: 'User not found' });
        }
        const tasks = await TaskModel.find({ user: userLog._id });
        res.send(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/addTodo', async (req, res) => {
    try {
        const { title, list, type, user } = req.body;
        console.log(user);
        const userInfo = await UserModel.findOne(user);
        console.log(userInfo);

        if (!userInfo) {
            res.status(404).send("User not found.");
            return;
        }

        const newTask = new TaskModel({
            title,
            list: {
                value: list.value,
                color: list.color
            },
            type: {
                value: type.value,
                color: type.color
            },
            user: userInfo._id
        });

        await newTask.save();

        res.status(201).send("Task added successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error.");
    }
});


router.delete("/removeTodo/:id", async (req, res) => {
    const todoId = req.params.id;
    if (!todoId) {
        return res.status(400).send("No id found");
    }

    try {
        const todo = await TaskModel.findByIdAndDelete(todoId);
        if (!todo) {
            return res.status(404).send("Todo not found");
        }
        res.send("Todo removed successfully");
    } catch (error) {
        console.error("Error removing todo:", error);
        res.status(500).send("Internal server error");
    }
});




module.exports = router;