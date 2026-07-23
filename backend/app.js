import dotenv from "dotenv";
dotenv.config();


import express from "express";
import mongoose from "mongoose";
import cors from "cors";


import { createServer } from "http";
import { connectToSocket } from "./controller/SocketManager.js";

import userRoutes from './routes/User.js'; 

const app = express();
const server = createServer(app);

// Use your socket connection function here
const io = connectToSocket(server);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb"}));

app.use('/', userRoutes);  


app.get("/home", (req, res) => {
  res.json({ hello: "world" });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`);
  await connectDB();
});


