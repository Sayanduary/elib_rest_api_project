import express from "express";
import {
   createBook,
   deleteBook,
   getAllBook,
   getSingleBook,
   updateBook,
} from "./book.Controller.ts";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import authenticate from "../middlewares/aunthenticate.ts";

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
   authenticate,
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "file", maxCount: 1 },
   ]),

   createBook,
);

bookRouter.patch(
   "/:bookId",
   authenticate,
   upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "file", maxCount: 1 },
   ]),
   updateBook,
);

bookRouter.get("/", getAllBook);

bookRouter.get("/:bookId", getSingleBook);

bookRouter.delete("/:bookId", authenticate, deleteBook);

export default bookRouter;
