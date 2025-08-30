import { Router } from "express";
import { getCurrentUser, login, logOut, register } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(register)
userRouter.route("/login").post(login)
userRouter.route("/get-user").get(verifyJWT,getCurrentUser)
userRouter.route("/logout").get(verifyJWT,logOut)

export {userRouter}