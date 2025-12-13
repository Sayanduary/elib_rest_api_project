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

export const updateBook = async (
   req: AuthRequest,
   res: Response,
   next: NextFunction,
) => {
   try {
      const { title, genre, description } = req.body;
      const bookId = req.params.bookId;

      const book = await bookModel.findById(bookId);
      if (!book) {
         return next(createHttpError(404, "Book not found"));
      }

      // Authorization check
      if (book.author.toString() !== req.userId) {
         return next(createHttpError(403, "Unauthorized"));
      }

      const files = req.files as { [key: string]: Express.Multer.File[] };

      let updatedCoverUrl = book.coverImage;
      let updatedPdfUrl = book.file;
      let updatedCoverPid = book.coverPublicId;
      let updatedPdfPid = book.pdfPublicId;

      const coverFile = files?.coverImage?.[0];
      const pdfFile = files?.file?.[0];

      // Handle cover image update
      if (coverFile) {
         const coverPath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            coverFile.filename,
         );

         // Delete old cover from Cloudinary
         if (book.coverPublicId) {
            await cloudinary.uploader.destroy(book.coverPublicId);
         }

         // Upload new cover
         const coverUpload = await cloudinary.uploader.upload(coverPath, {
            folder: "book-covers",
         });

         updatedCoverUrl = coverUpload.secure_url;
         updatedCoverPid = coverUpload.public_id;

         // Cleanup
         fs.promises.unlink(coverPath).catch(() => {});
      }

      // Handle PDF update
      if (pdfFile) {
         const pdfPath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            pdfFile.filename,
         );

         // Delete old PDF from Cloudinary
         if (book.pdfPublicId) {
            await cloudinary.uploader.destroy(book.pdfPublicId, {
               resource_type: "raw",
            });
         }

         // Upload new PDF
         const pdfUpload = await cloudinary.uploader.upload(pdfPath, {
            resource_type: "raw",
            folder: "book-files",
            format: "pdf",
         });

         updatedPdfUrl = pdfUpload.secure_url;
         updatedPdfPid = pdfUpload.public_id;

         // Cleanup
         fs.promises.unlink(pdfPath).catch(() => {});
      }

      // Update book record
      const updatedBook = await bookModel.findByIdAndUpdate(
         bookId,
         {
            title: title || book.title,
            genre: genre || book.genre,
            description: description || book.description,
            coverImage: updatedCoverUrl,
            file: updatedPdfUrl,
            coverPublicId: updatedCoverPid,
            pdfPublicId: updatedPdfPid,
         },
         { new: true },
      );

      return res.status(200).json({
         success: true,
         message: "Book updated successfully",
         data: updatedBook,
      });
   } catch (error) {
      console.error(error);
      return next(createHttpError(500, "Error updating book"));
   }
};
