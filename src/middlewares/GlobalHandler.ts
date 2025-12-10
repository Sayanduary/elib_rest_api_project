import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "http-errors";
import { config } from "../config/config.ts";

const GlobalErrorHandler = (
   err: HttpError,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const statusCode = err.statusCode || 500;

   return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: config.env === "development" ? err.stack : undefined,
   });
};

export default GlobalErrorHandler;
