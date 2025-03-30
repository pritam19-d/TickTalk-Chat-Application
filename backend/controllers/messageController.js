import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

const sendMessage = asyncHandler(async (req, res) => {
  const {content, chatId} = req.body;
  
  if (!content || !chatId) {
    console.log("Invalid data passed into request.");
    return res.sendStatus(400)
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
  }

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email"
      });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    })
    res.status(200).json(message)
  } catch (err) {
    res.status(400);
    throw new Error(err.message)
  }
});

const allMessages = asyncHandler(async (req, res)=>{
  try {
    if (req.params.chatId === "null") {
      res.status(204).json({message:"No chat is selected"})
    } else {
      const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name pic email").populate("chat")
      res.status(200).json(messages)
    }
  } catch (err) {
    res.status(400);
    throw new Error(err.message)
  }
})

export { sendMessage, allMessages };
