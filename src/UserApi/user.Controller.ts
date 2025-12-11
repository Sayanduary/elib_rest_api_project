import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";
import userModel from "./user.Model.ts";
import type { User } from "./userTypes.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
         return next(createHttpError(400, "All fields are required"));
      }
      // Check existing user
      try {
         const existingUser = await userModel.findOne({ email });
         if (existingUser) {
            return next(
               createHttpError(400, "User already exists with this email"),
            );
         }
      } catch (err) {
         return next(createHttpError(500, "Erorr while getting user"));
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser: User;
      // Create new user
      try {
         newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
         });
      } catch (err) {
         return next(createHttpError(500, "Error while sigining jwt"));
      }

      // Generate JWT token

      try {
         const token = jwt.sign(
            { sub: newUser._id.toString() },
            config.jwtSecret as string,
            {
               expiresIn: "7d",
            },
         );
         // Response
         return res.status(201).json({
            message: "Succesfully User Registerted",
            accessToken: token,
         });
      } catch (err) {
         return next(createHttpError(500, "Error Generating Token"));
      }
   } catch (err) {
      next(err);
   }
};
// End Point for login
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         next(createHttpError(400, "Email or Password is Required"));
      }
      try {
         const existingUser = await userModel.findOne({ email });
         if (!existingUser) {
            return next(createHttpError(404, "Email is not Registered"));
         }
         const isMatched = await bcrypt.compare(
            password,
            existingUser.password,
         );
         if (!isMatched) {
            return next(
               createHttpError(401, "Username or Password is Incorrect"),
            );
         }
         // create accesstoken
         const token = jwt.sign(
            { sub: existingUser._id.toString() },
            config.jwtSecret as string,
            {
               expiresIn: "7d",
            },
         );
         return res.status(201).json({
            message: "Succesfully Logged In",
            accessToken: token,
         });
      } catch (err) {
         return next(createHttpError(500, "Internal Server error"));
      }
   } catch (err) {
      next(err);
   }
};

export { createUser, loginUser };
