import mongoose, {Schema} from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

const userScems = new Schema({
   username: {
    type: String,
    required: true,
    unique: true,
    lowecase: true,
    trim: true,
    index: true
   },
   email: {
    type: String,
    required: true,
    unique: true,
    lowecase: true,
    trim: true,
   },
   fullName: {
    type: String,
    required: true,
    trim: true,
    index: true
   },
   avatar: {
    type: String, //cloudinary url
    required: true,
   },
   coverImage: {
    type: String,
   },
   watchHistory: {
    type: Schema.Types.ObjectId,
    ref:"Video",
   },
   password: {
    type: String,
    required: [true, 'password is required'],
   },
   refreshToken: {
    type: String,
   },

},
{timestamps: true}
)


userScems.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userScems.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userScems.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userScems.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
            _id: this._id,
          
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userScems)
