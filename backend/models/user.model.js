import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : [true,"username is not provided"]
    },
    email : {
        type : String,
        unique : true,
        required : [true,"Email is required"]
    },
    password : {
        type : String,
        required : [true,"password is required"]
    },
    profilePic : {
        type : String,
        default : "",
    },
    bio : {
        type : String,
        default : ""
    },
    gender : {
        type : String,
        enum : ["male","female"]
    },
    follower : [ { type : mongoose.Schema.Types.ObjectId , ref : "User" } ] ,
    following : [{ type : mongoose.Schema.Types.ObjectId , ref : "User" }],
    posts : [ { type : mongoose.Schema.Types.ObjectId , ref : "Post" } ],
    bookmarks : [ {type : mongoose.Schema.Types.ObjectId , ref : "Post" } ]
},{
    timestamps : true
})

const User  = mongoose.model("User",userSchema);
export default User;