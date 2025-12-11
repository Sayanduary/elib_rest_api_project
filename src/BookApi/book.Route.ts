import express from "express";
import { createBook } from "./book.Controller.ts";

const bookRouter = express.Router();

bookRouter.post("/", createBook);

export default bookRouter;
