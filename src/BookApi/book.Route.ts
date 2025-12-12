import express from "express";
import { createBook } from "./book.Controller.ts";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const bookRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// file store local -->
const upload = multer({
   dest: path.resolve(__dirname, "../../public/data/uploads"),
   limits: { fileSize: 3e7 }, // 30 mb
});

bookRouter.post(
   "/",
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "file", maxCount: 1 },
   ]),
   (req, res, next) => {
      console.log("FILES:", req.files);
      console.log("BODY:", req.body);
      next();
   },
   createBook,
);

export default bookRouter;
