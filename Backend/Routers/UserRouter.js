const express = require('express')
const router = express.Router()
const UserModel = require('../Models/User')

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            res.send("All the fields are required")
        }
        const userInfo = {
            email: email,
        }
        req.session.user = userInfo
        const User = new UserModel({
            username, email, password
        })
        await User.save()
        res.status(201).send("User added successfully.");
    } catch (error) {
        console.log(error);
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body


    const user = await UserModel.findOne({ email: email })
    if (!user) {
        res.send("No user found")
    }

    if (password === user['password']) {
        res.sendStatus(200)
    }
    else {
        res.sendStatus(400)

    }
})

module.exports = router;