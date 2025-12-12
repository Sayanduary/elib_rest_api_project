import type { Response, NextFunction } from "express";
import cloudinary from "../config/Cloudinary.ts";
import path from "node:path";
import { fileURLToPath } from "url";
import createHttpError from "http-errors";
import bookModel from "./book.Model.ts";
import type { Book } from "./book.Types.ts";
import fs from "node:fs";
import type { AuthRequest } from "./AuthRequest.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createBook = async (
   req: AuthRequest,
   res: Response,
   next: NextFunction,
) => {
   try {
      const { title, genre, description } = req.body;
      const userId = req.userId;

      if (!userId) {
         return next(createHttpError(401, "Login required to upload a book"));
      }

      if (!title || !genre || !description) {
         return next(
            createHttpError(400, "Title, Genre, and Description required"),
         );
      }

      const files = req.files as { [key: string]: Express.Multer.File[] };

      if (!files?.coverImage?.[0] || !files?.file?.[0]) {
         return res.status(400).json({
            success: false,
            message: "Both cover image and PDF file are required",
         });
      }

      const coverFile = files.coverImage[0];
      const pdfFile = files.file[0];

      const coverPath = path.resolve(
         __dirname,
         "../../public/data/uploads",
         coverFile.filename,
      );
      const pdfPath = path.resolve(
         __dirname,
         "../../public/data/uploads",
         pdfFile.filename,
      );

      // Upload Cover Image
      const coverUpload = await cloudinary.uploader.upload(coverPath, {
         folder: "book-covers",
      });

      // Upload PDF
      const pdfUpload = await cloudinary.uploader.upload(pdfPath, {
         resource_type: "raw",
         folder: "book-files",
         format: "pdf",
      });

      // Save in MongoDB

      const newBook: Book = await bookModel.create({
         title,
         genre,
         description,
         author: userId, // logged-in user
         coverImage: coverUpload.secure_url,
         file: pdfUpload.secure_url,
         coverPublicId: coverUpload.public_id,
         pdfPublicId: pdfUpload.public_id,
      });

      // Cleanup local temp files
      fs.promises.unlink(coverPath).catch(() => {});
      fs.promises.unlink(pdfPath).catch(() => {});

      return res.status(201).json({
         success: true,
         message: "Book uploaded successfully",
         id: newBook._id,
         data: newBook,
      });
   } catch (error) {
      return next(createHttpError(500, "Error Uploading Book"));
   }
};
