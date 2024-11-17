import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

const accessChat = asyncHandler(async (req, res) => {
	const { userId } = req.body;
	if (!userId) {
		console.log("User id doesnt exists");
		return res.sendStatus(400);
	}

	let isChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },
			{ users: { $elemMatch: { $eq: userId } } },
		],
	}).populate("users", "-password").populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email"
  })

  if(isChat.length > 0){
    res.send(isChat[0])
  } else {
    let chatData = {
      chatName : "sender",
      isGroupChat: false,
      users: [req.user._id, userId]
    }

    try {
      const createdChat = await Chat.create(chatData)
      const fullChat = await Chat.findOne({ _id: createdChat._id}).populate("users", "-password");

      res.status(200).send(fullChat)
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async(req, res)=>{
  try {
    Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
      .then(result => res.send(result));
  } catch (error) {
    
  }
});


export { accessChat, fetchChats };
