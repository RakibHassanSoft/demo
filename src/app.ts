import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // 🔥 ADD THIS

import userRoutes from "./modules/user/user.routes";

dotenv.config();

const app = express();


app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);



app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});



app.use("/api/users", userRoutes);

export default app;