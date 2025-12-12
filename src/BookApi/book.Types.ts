import type { User } from "../UserApi/userTypes.ts";
import mongoose from "mongoose";
export type Book = {
   _id: string; // or Types.ObjectId if you use it
   title: string;
   genre: string;
   author: mongoose.Schema.Types.ObjectId;
   coverImage: string;
   file: string;
   coverPublicId: string;
   pdfPublicId: string;
   createdAt?: Date;
   updatedAt?: Date;
};
