import { createUser, login } from "../../service/user/userServices.js";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/register", createUser);
userRouter.post("/login", login);

export default userRouter;
