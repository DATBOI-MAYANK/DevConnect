import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, "");
      if (!origin || allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


app.use(express.json({ limit: "70mb" }));
app.use(express.urlencoded({ limit: "50kb", extended: true }));
app.use(cookieParser());

import userRouter from "./Routes/user.routes.js";
import adminRouter from "./Routes/admin.routes.js";
import postRouter from "./Routes/post.routes.js";

app.use("/users", userRouter);
app.use("/users", postRouter);
app.use("/admin", adminRouter);

import errorHandler from "./middlewares/errorHandler.middleware.js";
app.use(errorHandler);

export { app };
