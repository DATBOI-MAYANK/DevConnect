import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json({ limit: "70kb" }));
app.use(express.urlencoded({ limit: "50kb" , extended: true  }));
app.use(cookieParser());

import userRouter from "./Routes/user.routes.js";
import adminRouter from "./Routes/admin.routes.js";

app.use("/users", userRouter);
app.use("/admin", adminRouter);

export { app };
