import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./user.Model.ts";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
   const { name, email, password } = req.body;
   // validation
   const error = createHttpError(400, "All Fields are required");
   if (!name || !email || !password) {
      return next(error);
   }
   //Database call
   const user = await userModel.findOne({ email: email });

   if (user) {
      const error = createHttpError(400, "User already exist with this email");
      return next(error);
   }

   // password --> hashing
   const hashedPassword = await bcrypt.hash(password, 10);
   //Process
   
   // Response
   res.json({
      message: "User Created",
   });
};

export { createUser };
