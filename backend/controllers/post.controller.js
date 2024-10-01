import sharp from "sharp";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import Comment from "../models/comment.model.js";


export const addNewPost = async(req,res) =>{
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;
        if(!image || !caption)
            return res.status(400).json({
        success : false,
        message : "Image required"
        })
         
        // image upload to low quality
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width : 800,height : 800,fit : "inside"})
        .toFormat('jpeg',{quality : 80})
        .toBuffer();

        // buffer to dat uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption ,
            image : cloudResponse.secure_url,
            author : authorId
        })

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({path : "author" , select : "-password" })
        
        return res.status(201).json({
            success : true,
            message : "New Post added",
            post
        })


    } catch (error) {
        
    }
}

export const getAllPost = async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt : -1})
        .populate({path : "author",select : "username , profilePic"})
        .populate({path : "comments" , 
            sort : {createdAt : -1} ,
            populate : {
                path : "author",
                select : "username , profilePic"
            }
        })
        res.status(200).json({
            success : true,
            posts,

        })
        
    } catch (error) {
        console.log("Error in getAllpost");
    }
}

export const getUserPost = async(req,res)=>{
    try {
        const authorId = req.id;
        console.log(authorId) 
        const allPosts = await Post.find({ author : authorId})
                               .sort({createdAt : -1})
                               .populate ({path : "author" , select : "username , profilePic"})
                               .populate({path : "comments" , 
                                sort : {createdAt : -1} ,
                                populate : {
                                    path : "author",
                                    select : "username , profilePic"
                                }
                            }) 
        return res.status(200).json({
            success : true ,
            allPosts,

        })
    } catch (error){
        console.log("error in get all user post")
    }
}

export const likePost = async(req,res) =>{
    try {
        const userId  = req.id;
    const postId = req.params.id;
    console.log("post id coming is ",postId)
    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({
            success : false,
            message : "post not found"
        })
    } 
    // like logic for post 
    // post.likes.push() -> we can not use this method because a single user 
    // can only add multiple likes which is not correct   
    await post.updateOne({$addToSet : { likes : userId }});
   
    // here, addToSet is adding data in the form of set 
    await post.save();

    // implement socket io for real time notification
    
    return res.status(201).json({
        success : true,
        message : "post liked successfully"
    })
    } catch (error) {
        console.log("Error in like post ",error.message);
    }


}

export const dislikePost = async(req,res) =>{
    try {
        const userId  = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if(!post){
        return res.status(404).json({
            success : false,
            message : "post not found"
        })
    }
    // like logic for post 
    // post.likes.push() -> we can not use this method because a single user 
    // can only add multiple likes which is not correct   
    await post.updateOne({$pull : { likes : userId }});
    // here, addToSet is adding data in the form of set 
    await post.save();

    // implement socket io for real time notification
    
    return res.status(201).json({
        success : true,
        message : "post unliked successfully"
    })
    } catch (error) {
        console.log("Error in like post")
    }


}

export const addComment = async(req,res) =>{
    try {
        const userId = req.id;
        const postId = req.params.id;
        const {text} = req.body;
        const post = await Post.findById(postId);
        if(!text)
            return res.status(400).json({
        success : false,
        message : "text is required"
        })
        console.log("befor comment")
        let comment = await Comment.create({
            text ,
            author : userId,
            post : postId
        })
        comment = await comment.populate({
            path: 'author',
            select: 'username profilePic',
          }) 
 
        post.comments.push(comment._id); 
        await post.save();
        return res.status(201).json({
            success : true,
            message : "Comment added",
            comment
        })

        

    } catch (error) {
        console.log("Error in add comment tab ",error.message)
    }
}
 
  
export const getCommentOfPost = async(req,res)=>{
    try {
        const {id : postId} =  req.params;
        const comments = await Comment.find({post : postId})    
                                .populate('author','username , profilePic ')

        if(!comments)
            return res.status(404).json({
        success : false,
        message : "No commments available"
        })

        return res.status(201).json({
            success : true,
            comments
        })

    } catch (error) {
        console.log("Error in getCommentOfpost");  
    }
}

export const deletePost = async(req,res)=>{
    try {
        const {id:postId} = req.params;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post)
            return res.status(404).json({
                success : false,
                message : "Post not found"
        })
        // check if the logged in user is the owner of the post
        if(post.author.toString() != authorId)
            return res.status(403).json({
                success : false,
                message : "Unauthorise"
        })
        // delete post 

        // const deletedPost = 
        await Post.findByIdAndDelete(postId);
        // remove postid from user
        let user = await User.findById(authorId);
        user.posts = user.posts.filter((id)=>id.toString() != postId.toString())
        await user.save();
        // delete all comments of that post 
        await Comment.deleteMany({post : postId});
        return res.status(201).json({
            success : true,
            message : "post deleted successfully"
        })


    } catch (error) {
        console.log("Error in delete post")
    }
}

export const bookmarkPost = async(req,res)=>{
    try {
        const authorId = req.id;
        const {id : postId} = req.params;
        const post = await Post.findById(postId);
        if(!post)
            return res.status(404).json({
        success : false,
        message : "Post not found"
    })
    const user = await User.findById(authorId);
    if(user.bookmarks.includes(post._id)){
        // already bookmarked -> remove from bookmark
        await user.updateOne({ $pull : {bookmarks : post._id} });
        await user.save();
        return res.status(201).json({
            success : true,
            message : "post removed from bookmark",
            type : "unsaved"
        })
    }else{
        await user.updateOne({ $addToSet : {bookmarks : post._id} });
        await user.save();
        return res.status(201).json({
            success : true,
            message : "post bookmarked",
            type : "saved"
        })
    }

        
    } catch (error) {
        console.log("error in bookmarkPost");
    }
}

