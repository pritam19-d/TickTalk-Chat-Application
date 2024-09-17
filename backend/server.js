import express from "express";
import chats from "./data/data.js";
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000;

app.get("/",(req, res)=>{
  res.send("API is Running.")
})

app.get("/api/chats", (req, res)=>{
  res.send(chats)
})

app.get("/api/chats/:id", (req, res)=>{
  const chat = chats.find((cht)=> cht._id === req.params.id)
  res.send(chat)
})

app.listen(PORT, console.log(`Server is up on port ${PORT}`))