import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";


//Register the user and generate the token 
const registerUser = asyncHandler(async (req, res)=>{
  const { name, email, password, pic } = req.body
  
  if(!name|| !email || !password){
    res.status(400);
    throw new Error("Please fill out all the mandatory fields")
  }
  const usrExist = await User.findOne({ email })
  if (usrExist){
    res.status(400)
    throw new Error("User already exists")
  }
  const user = await User.create({
    name, email, password, pic
  })
  if (user){
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic
    })
  }else{
    res.status(400)
    throw new Error("Invald User data")
  }
})

//Login for an existing user 
const authUser = asyncHandler(async (req, res)=>{
  const { email, password }= req.body;
  const user = await User.findOne({ email })

  if (user && (await user.checkPwd(password)) ){
    generateToken(res, user._id)

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic
    })
  }else{
    res.status(401)
    throw new Error("Invalid Email or Password")
  }
})

//Logout User Controller
const logoutUser = asyncHandler (async (req, res)=>{
  res.cookie("jwt", "",{
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "Logged out Successfully!"})
})

// /api/user?keyword=pritam
const allUsers = asyncHandler( async(req, res)=> {
  const keyword = req.query.keyword ? {
    $or: [
      {name : { $regex: req.query.keyword, $options: "i"}},
      {email : { $regex: req.query.keyword, $options: "i"}}
    ]
  } : {}
  
  if (req.query.keyword.length > 2){
    const users = await User.find({...keyword}).find({_id:{ $ne:req.user._id }}).select("-password");
    res.status(200).send(users);
  } else {
    res.status(204)
    throw new Error("Search letter insufficient")
  }
});



export { registerUser, authUser, logoutUser, allUsers }
