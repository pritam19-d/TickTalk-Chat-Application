import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
const PORT = process.env.PORT || 8000;

connectDB(); //connect to MongoDB database

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("API is Running.");
});

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () =>
	console.log(`Server is up on port ${PORT}`.blue.bold.underline)
);

const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: ["http://localhost:3000"],
	},
});

io.on("connection", (socket) => {
	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});
	socket.on("join chat", (room) => {
		if (room) {
			socket.join(room);
			console.log("User joined room-", room);
		}
	});
  socket.on("new message", (newMessageReceived) =>{
    const chat = newMessageReceived.chat;
    if(!chat.users) return console.log("server.js @line 62-chat.users is not defined");

    chat.users.forEach( user => {
      if(user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived)
    });
    
  })
	// console.log(`connect: ${socket.id}`);
});
