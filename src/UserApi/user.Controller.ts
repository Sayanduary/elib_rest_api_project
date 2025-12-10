import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
   const { name, email, password } = req.body;
   // validation
   const error = createHttpError(400, "All Fields are required");
   if (!name || !email || !password) {
      return next(error);
   }
   //Process
   // Response
   res.json({
      message: "User Created",
   });
};

export { createUser };
