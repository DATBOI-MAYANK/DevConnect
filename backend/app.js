import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "70kb" }));
app.use(express.urlencoded({ limit: "50kb", extended: true }));
app.use(cookieParser());


import userRouter from "./Routes/user.routes.js";
import adminRouter from "./Routes/admin.routes.js";
import postRouter from "./Routes/post.routes.js"


app.use("/users", userRouter);
app.use("/users", postRouter);
app.use("/admin", adminRouter);

import errorHandler from "./middlewares/errorHandler.middleware.js";
app.use(errorHandler);

export { app };
