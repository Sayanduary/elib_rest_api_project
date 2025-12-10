import express from "express";
import { createUser } from "./user.Controller.ts";

const userRouter = express.Router();

userRouter.post("/register", createUser);

export default userRouter;
