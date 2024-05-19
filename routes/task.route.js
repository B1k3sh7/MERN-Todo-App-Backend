import { Router } from "express";
import {
  addTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.route("/").post(addTask).patch(updateTask).delete(deleteTask);

router.route("/:jwt").get(getTasks);

export default router;
