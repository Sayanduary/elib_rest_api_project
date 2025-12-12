import type { Request, Response, NextFunction } from "express";
import cloudinary from "../config/Cloudinary.ts";
import path from "node:path";
import { fileURLToPath } from "url";

// Fix ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const files = req.files as { [key: string]: Express.Multer.File[] };

      // Validation
      if (!files || !files.coverImage || !files.coverImage[0]) {
         throw new Error("Cover image is required");
      }

      const coverFile = files.coverImage[0];
      const coverExt = coverFile.mimetype.split("/").at(-1) || "jpg";
      const fileName = coverFile.filename;

      // Absolute local file path
      const filePath = path.resolve(
         __dirname,
         "../../public/data/uploads",
         fileName,
      );

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
         filename_override: fileName,
         folder: "book-covers",
         format: coverExt,
      });
      console.log("uploadResult", uploadResult);
      return res.status(201).json({
         message: "Book cover uploaded successfully",
         cloudinaryUrl: uploadResult.secure_url,
         publicId: uploadResult.public_id,
      });
   } catch (error) {
      next(error);
   }
};

export { createBook };
