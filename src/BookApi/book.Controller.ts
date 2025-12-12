import type { Request, Response, NextFunction } from "express";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
   try {
   } catch (err) {
      next(err);
   }
};

export { createBook };
