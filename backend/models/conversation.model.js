import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participitants : [ {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    } ],
    messages : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Messsage"
    }]

},{
    timestamps : true
})

const Conversation = mongoose.model("Conversation",conversationSchema);
export default Conversation;