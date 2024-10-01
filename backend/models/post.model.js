import mongoose from "mongoose";

const postSchema =new mongoose.Schema({
    caption : {
        type : String,
        default : "",
    },
    image : {
        type : String,
        required : [true,"Please upload image"]
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true,"author is not provided"]
    },
    likes : [ {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    } ],
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }]
},{
    timestamps : true
} )



const Post = mongoose.model("Post",postSchema);
export default Post;