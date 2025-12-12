import type { Request, Response, NextFunction } from "express";
import cloudinary from "../config/Cloudinary.ts";
import path from "node:path";
import { fileURLToPath } from "url";
import createHttpError from "http-errors";

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const files = req.files as { [key: string]: Express.Multer.File[] };

      if (!files?.coverImage?.[0] || !files?.file?.[0]) {
         return res.status(400).json({
            success: false,
            message: "Both cover image and PDF file are required",
         });
      }

      const coverFile = files.coverImage[0];
      const pdfFile = files.file[0];

      // Resolve local paths
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

      // Upload COVER IMAGE
      const coverUpload = await cloudinary.uploader.upload(coverPath, {
         filename_override: coverFile.filename,
         folder: "book-covers",
      });

      // Upload PDF AS RAW FILE
      const pdfUpload = await cloudinary.uploader.upload(pdfPath, {
         resource_type: "raw", // Required for PDFs
         filename_override: pdfFile.filename,
         folder: "book-files",
         format: "pdf",
      });

      return res.status(201).json({
         success: true,
         message: "Book uploaded successfully",
         coverImageUrl: coverUpload.secure_url,
         pdfUrl: pdfUpload.secure_url,
         coverPublicId: coverUpload.public_id,
         pdfPublicId: pdfUpload.public_id,
      });
   } catch (error) {
      next(createHttpError(500, "Error Uploading Book"));
   }
};

export { createBook };
