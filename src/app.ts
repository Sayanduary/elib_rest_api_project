import express from "express";

const app = express();

//Routes
// http methods ;GET , POST , PUT , DELETE

app.get("/", (req, res, next) => {
   res.json({
      message: "Welcome to elib API's",
   });
});

export default app;
