import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    // comment which the user has made 
    text : {
        type : String,
        required : [true,"Please give comment"]
    },
    // user who has commented
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    // post for which someone has comment
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required : [true,"post is not given"]
    }
},{
    timestamps : true
})

const Comment = mongoose.model("Comment",commentSchema);
export default Comment;