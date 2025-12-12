import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";
import type { AuthRequest } from "../BookApi/AuthRequest.ts"; 

const authenticate = (req: Request, res: Response, next: NextFunction) => {
   const token = req.header("Authorization");

   if (!token) {
      return next(createHttpError(401, "Authorization token is required"));
   }

   try {
      const passed = token.split(" ")[1];
      const decoded = jwt.verify(passed as string, config.jwtSecret as string);

      const _req = req as AuthRequest;
      _req.userId = decoded.sub as string;

      return next();
   } catch (error) {
      return next(createHttpError(401, "Invalid or expired token"));
   }
};

export default authenticate;
