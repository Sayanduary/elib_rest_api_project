import type { Request, Response, NextFunction } from "express";
import cloudinary from "../config/Cloudinary.ts";
import path from "node:path";
import { fileURLToPath } from "url";
import createHttpError from "http-errors";
import bookModel from "./book.Model.ts";
import type { Book } from "./book.Types.ts";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const { title, genre, author } = req.body;

      if (!title || !genre || !author) {
         return next(createHttpError(400, "Title, Genre, Author required"));
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

      // Upload image to Cloudinary
      const coverUpload = await cloudinary.uploader.upload(coverPath, {
         folder: "book-covers",
      });

      // Upload raw pdf
      const pdfUpload = await cloudinary.uploader.upload(pdfPath, {
         resource_type: "raw",
         folder: "book-files",
         format: "pdf",
      });

      // Save in MongoDB
      let newBook: Book;
      newBook = await bookModel.create({
         title,
         genre,
         author,
         coverImage: coverUpload.secure_url,
         file: pdfUpload.secure_url,
         coverPublicId: coverUpload.public_id,
         pdfPublicId: pdfUpload.public_id,
      });
      try {
         await fs.promises.unlink(coverPath);
         await fs.promises.unlink(pdfPath);
      } catch (error) {
         next(error);
      }
      return res.status(201).json({
         id: newBook._id,
         success: true,
         message: "Book uploaded successfully",
         data: newBook,
      });
   } catch (error) {
      return next(createHttpError(500, "Error Uploading Book"));
   }
};

export { createBook };
