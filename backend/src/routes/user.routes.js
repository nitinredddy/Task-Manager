import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.route("/register").post(register)
userRouter.route("/login").post(login)

export {userRouter}