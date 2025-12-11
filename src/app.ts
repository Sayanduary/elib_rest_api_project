import express from "express";
import GlobalErrorHandler from "./middlewares/GlobalHandler.ts";
import userRouter from "./UserApi/user.Router.ts";
import type { NextFunction, Request, Response } from "express";
import bookRouter from "./BookApi/book.Route.ts";

const app = express();
app.use(express.json());
//Routes
// http methods ;GET , POST , PUT , DELETE

app.get("/", (req: Request, res: Response, next: NextFunction) => {
   res.json({
      message: "Welcome to elib API's",
   });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global Error Handling
app.use(GlobalErrorHandler);

export default app;
