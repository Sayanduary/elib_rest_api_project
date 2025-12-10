import express from "express";
import GlobalErrorHandler from "./middlewares/GlobalHandler.ts";
import userRouter from "./UserApi/user.Router.ts";

const app = express();
app.use(express.json());
//Routes
// http methods ;GET , POST , PUT , DELETE

app.get("/", (req, res, next) => {
   res.json({
      message: "Welcome to elib API's",
   });
});

app.use("/api/users", userRouter);

// Global Error Handling
app.use(GlobalErrorHandler);

export default app;
