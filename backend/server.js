import express from "express";
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
const PORT = process.env.PORT || 8000;

connectDB() //connect to MongoDB database

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Cookie parser middleware
app.use(cookieParser())

app.get("/",(req, res)=>{
  res.send("API is Running.")
})

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>console.log(`Server is up on port ${PORT}`.blue.bold.underline))