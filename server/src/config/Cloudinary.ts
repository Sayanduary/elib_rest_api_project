import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.ts";


if (!config.cloud_name || !config.api_key || !config.api_secret) {
   throw new Error("Cloudinary env variables are missing");
}
cloudinary.config({
   cloud_name: config.cloud_name,
   api_key: config.api_key,
   api_secret: config.api_secret,
});

export default cloudinary;
