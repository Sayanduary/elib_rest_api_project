import express from "express";
import { createBook } from "./book.Controller.ts";
import path from "path";
import multer from "multer";

const bookRouter = express.Router();

// file store local -->
const upload = multer({
   dest: path.resolve(__dirname, "../../public/data/uploads"),
   limits: { fileSize: 3e7 }, // 30 mb
});

bookRouter.post(
   "/",
   upload.fields([
      { name: "coverImage,", maxCount: 1 },
      { name: "file,", maxCount: 1 },
   ]),
   createBook,
);

export default bookRouter;
