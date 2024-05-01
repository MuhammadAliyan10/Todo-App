const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const taskRouter = require("./Routers/TodoRouter.js");
const userRouter = require("./Routers/UserRouter");
import("./Database/Connect.js");
app.use(cors());

app.use(express.json());

app.use("/tasks", taskRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Got it 200");
});

app.listen(port, () => {
  console.log("App is running on port");
});
