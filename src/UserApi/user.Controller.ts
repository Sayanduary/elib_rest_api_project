import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./user.Model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
         return next(createHttpError(400, "All fields are required"));
      }

      // Check existing user
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
         return next(
            createHttpError(400, "User already exists with this email")
         );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await userModel.create({
         name,
         email,
         password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign(
         { sub: newUser._id.toString() },
         config.jwtSecret as string,
         { expiresIn: "7d" }
      );

      // Response
      return res.status(201).json({
         accessToken: token,
      });
   } catch (err) {
      next(err);
   }
};

export { createUser };
