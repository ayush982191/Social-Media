import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
// for chatting
export const sendMessage = async (req,res)=>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participitants : { $all : [senderId,receiverId] }
        });
        // establish the conversation if not started yet
        if(!conversation){
            conversation = await Conversation.create({
                participitants : [ senderId , receiverId ]
            })
        }
        const newMessage = await Message.create({
            senderId ,
            receiverId 
        })
        if(newMessage)
            conversation.messages.create({
        senderId , 
        receiverId , 
        message
        })
        if(newMessage)
            conversation.messages.push(newMessage._id);
        // await conversation.save();
        // await newMessage.save();
        await Promise.all( [ conversation.save() , newMessage.save() ] );
        // implement socketio for real time data transfer


        return res.status(201).json({
            success : true,
            newMessage

        })
        
    } catch (error) {
        console.log("error in send message",error.message);
    }
}

export const getMessage = async (req,res)=>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.find({
            participitants : { $all : [senderId , receiverId] } 
        })
        if(!conversation)
            return res.status(200).json({
        success : true,
        messages : []
        })
        return res.status(200).json({
            success : true,
            messages : conversation?.messages
        })


    } catch (error) {
        console.log("Error in getMessage");
    }
}
