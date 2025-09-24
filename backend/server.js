import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors"
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import corsOptions from "./config/corsConfig.js";
const PORT = process.env.PORT || 10000;

connectDB(); //connect to MongoDB database

const app = express();

//Cookie parser middleware
app.use(cookieParser());

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const __dirname = path.resolve(); //Set the __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

if (process.env.NODE_ENV === "production"){
  //set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")))
  //any route that is not api will be directed to index.html
  app.get("*", (req,res)=> res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")))
} else {
  app.get("/", (req,res)=>{
    res.send("Api is running..")
  });
}

// const httpServer = http.createServer(app);

const server = app.listen(PORT, "0.0.0.0", () =>
	console.log(`Server is up on port ${PORT}`.blue.bold.underline)
);

// const server = httpServer.listen(PORT, "0.0.0.0", () => {
// 	console.log(`🚀 Server is running on port ${PORT}`.blue.bold.underline);
// });

const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "*",
    credentials: true,
	},
});

const typingTimers = {};

io.on("connection", (socket) => {
	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});
  
	socket.on("join chat", (newRoom) => {
		if (newRoom) {
      for (let room of socket.rooms) {
        if (room !== socket.id) {
          socket.leave(room);
        }
      }
			socket.join(newRoom);
			// console.log("User joined room-", newRoom);
      // console.log(Array.from(socket.rooms))
		}
	});
  socket.on("typingSent", (room, userData)=> {
    socket.to(room).emit("typingRecvd", userData, room);
    // console.log("start typing called -", userData);

    if (!typingTimers[room]) typingTimers[room] = {};
    
    // Clear previous timer if exists
    if (typingTimers[room][userData.id]) {
      clearTimeout(typingTimers[room][userData.id]);
    }

    // Set new timer for 3s
    typingTimers[room][userData.id] = setTimeout(() => {
      socket.to(room).emit("stopTypingRecvd", userData, room);
      // console.log("stop typing emitted -", userData);
      delete typingTimers[room][userData.id]; // cleanup
    }, 3000);
  })
  socket.on("stopTypingSent", (room, userData)=> socket.to(room).emit("stopTypingRecvd", userData, room));
  socket.on("new message", (newMessageReceived, userData) =>{
    const chat = newMessageReceived.chat;
    if(!chat.users) return console.log("server.js @line 115-chat.users is not defined");

    chat.users.forEach( user => {
      if(user._id === userData) return;
      socket.to(chat._id).emit("message received", newMessageReceived);
    });
  });
  socket.off("setup", ()=>{
    console.log("User Disconnected")
    socket.leave(userData._id)
  })
});
