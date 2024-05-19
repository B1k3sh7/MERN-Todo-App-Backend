import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

const addTask = async (req, res) => {
  try {
    let task = await Task.create(req.body);
    console.log("Task Created", {
      user_id: req.body.user_id,
      task_id: task["_id"].toString(),
      tasks: task,
    });
    res.json({
      success: true,
      message: "Task created",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

const getTasks = async (req, res) => {
  console.log(req.params.jwt);
  if (req.params.jwt) {
    try {
      let token = jwt.verify(req.params.jwt, secretKey);
      let user = await User.findOne({ _id: token.payload });
      let uncompletedTask = await Task.find({
        user_id: user["_id"],
        status: false,
      });
      let completedTask = await Task.find({
        user_id: user["_id"],
        status: true,
      });
      res.json({
        success: true,
        message: "Task loaded successfully",
        user: user,
        uncompletedTask: uncompletedTask,
        completedtask: completedTask,
      });
    } catch (err) {
      res.json({
        success: false,
        message: err.message,
      });
    }
  } else {
    res.json({
      success: false,
      message: "No token found",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.body.task_id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    task = await Task.findOneAndUpdate(
      { _id: req.body.task_id },
      { status: true },
      { new: true }
    );
    console.log("Task Updated", {
      _id: req.body.task_id,
      task_id: task["_id"].toString(),
    });
    res.json({
      success: true,
      message: "Task updated",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.body.task_id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    task = await Task.findOneAndDelete({ _id: req.body.task_id });
    res.status(204).json({
      success: true,
      message: "Task deleted",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

export { addTask, getTasks, updateTask, deleteTask };
