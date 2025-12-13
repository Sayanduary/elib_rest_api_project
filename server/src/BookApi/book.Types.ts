import type { User } from "../UserApi/userTypes.ts";

export type Book = {
   _id: string; // or Types.ObjectId if you use it
   title: string;
   genre: string;
   author: string;
   description: string;
   coverImage: string;
   file: string;
   coverPublicId: string;
   pdfPublicId: string;
   createdAt?: Date;
   updatedAt?: Date;
};
