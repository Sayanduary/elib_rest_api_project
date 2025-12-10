import express from "express";
import createHttpError from "http-errors";
import GlobalErrorHandler from "./middlewares/GlobalHandler.ts";

const app = express();

//Routes
// http methods ;GET , POST , PUT , DELETE

app.get("/", (req, res, next) => {
   res.json({
      message: "Welcome to elib API's",
   });
});

// Global Error Handling
app.use(GlobalErrorHandler);

export default app;
