import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import messageRouter from "./routes/MsgRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import { app, server } from "./socket.js";

// Connect to Database
await db();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chat-habesha-mern-real-time-chat-ap.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "15MB" }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api", contactRouter);
app.use("/api", messageRouter);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on port " + PORT));
