import mongoose from "mongoose";
import type { Book } from "./book.Types.ts";
import userModel from "../UserApi/user.Model.ts";

const bookSchema = new mongoose.Schema<Book>(
   {
      title: {
         type: String,
         required: true,
      },
      author: {
         type: String,
         ref: "User",
         required: true,
      },
      coverImage: {
         type: String,
         required: true,
      },
      file: {
         type: String,
         required: true,
      },
      genre: {
         type: String,
         required: true,
      },
      description: { type: String, required: true },
   },
   { timestamps: true },
);

export default mongoose.model<Book>("Book", bookSchema);
