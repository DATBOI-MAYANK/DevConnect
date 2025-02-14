import "dotenv/config";
import express from "express";
import ConnectDB from "./Database/database.js";
const app = express();
const PORT = process.env.PORT || 8000;

ConnectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(() => {
      console.log(`App is listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection Failed !! ERROR:", error);
  });
