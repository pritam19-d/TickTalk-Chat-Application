import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  name:{
    type : String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  pic:{
    type:String,
    required: true,
    default: "https://www.svgrepo.com/show/335455/profile-default.svg"
  }
},{
  timestamps: true
});

userSchema.methods.checkPwd = async function (entPwd) {
  return (await bcrypt.compare(entPwd, this.password))
}
userSchema.pre("save", async function (next){
  if(!this.isModified("password")){
    next();
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema)

export default User