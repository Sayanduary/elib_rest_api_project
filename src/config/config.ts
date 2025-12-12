import dotenv from "dotenv";
dotenv.config();
const _config = {
   port: process.env.PORT,
   databaseURL: process.env.MONGO_CONNECTION_STRING,
   env: process.env.NODE_ENV,
   jwtSecret: process.env.JWT_SECRET,
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET,
};

export const config = Object.freeze(_config);
