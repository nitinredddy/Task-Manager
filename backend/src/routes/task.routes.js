import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createATask, deleteATask, getAllUserTasks, update } from "../controllers/task.controller.js";

const taskRouter = Router()

taskRouter.route("/create-a-task").post(verifyJWT,createATask)
taskRouter.route("/update-a-task/:taskId").patch(verifyJWT,update)
taskRouter.route("/delete/:taskId").delete(verifyJWT,deleteATask)
taskRouter.route("/get-all-tasks").get(verifyJWT,getAllUserTasks)

export {taskRouter}
