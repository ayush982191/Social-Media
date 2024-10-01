import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";


// {
//     "username" : "ayush982191",
//     "email" : "ayush@gmail.com",
//     "password" : "982191"
// }
export const register = async(req,res)=>{
    try {
        const { username,email,password } = req.body;
        if(!username || !email || !password)
            return res.status(400).json({
        success : false,
        message : "all fields required"
        })
        const user = await User.findOne({email});
        if(user)
            return res.status(409).json({
        success : false,
        message : "User already exist"
        })
        const hashPassword = await bcrypt.hash(password,10)

        const newUser = await User.create({
            username, email,password : hashPassword
        })
        return res.status(201).json({
            success : true,
            message : "Account created successfully"
        })



    } catch (error) {
        // console.log("Error ",error.message);
        console.log("Error in user controller")
    }
}


export const login = async(req,res)=>{
    try {
        const { email,password } = req.body;
        
        
         if(!email || !password)
            return res.status(404).json({
        success : false,
        message : "all fields required"
    })
    let user =await User.findOne({email});
    // console.log("user is ",user)
    
        if(!user)
            return res.status(404).json({
        success : false,
        message : "Email does not exist"
        })
    //    console.log("befor matching password")
        const isPasswrodMatch =await bcrypt.compare(password,user.password);
        // console.log("after matching password")
        if(!isPasswrodMatch)
            return res.status(404).json({
        success : false,
        message : "email or password incorrect"
        
    })
    const token = await jwt.sign({userId : user._id},process.env.SECERET_KEY, {expiresIn : '1d'});
    const populatedPost = await Promise.all( 
        user.posts.map(async (postId)=>{
            const post = await Post.findById(postId);
            if(post.author.equals(user._id))
                return post
            return null;
        })
     )
    user = {
        _id : user._id,
        username : user.username,
        email : user.email,
        profilePic : user.profilePic,
        bio : user.bio,
        followers : user.follower,
        following : user.following,
        posts : populatedPost
    }


    return res.cookie('token',token,{ httpOnly : true, sameSite : 'strict',maxAge : 1*24*60*60*60 }).json({
        success : true,
        message : `Welcome back ${user.username} `,
        details : user 
    }) 
    } catch (error) {
        console.log("Error coming IN LOGIN",error.message);
    }
}

export const logout = async(_,res)=>{
    try {
        res.cookie("token","",{maxAge : 0}).json({
            success : true,
            message : "Logged out successfully"
        })
    } catch (error) {
        console.log("Error in logout")
        
    }
}

export const getProfile = async(req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id).select("-password -__v -createdAt -updatedAt");
        res.status(201).json({
            success : true,
            user
        })  
    } catch (error) {
        console.log("error in get Profile");
    }
}

export const editProfile = async(req,res)=>{
    try {
        const userId = req.id; 
        const {bio,gender} = req.body;
        const profilePicture = req.file;  
        let cloudResponse; 
        if(profilePicture){
            const fileUri = getDataUri(profilePicture); 
            cloudResponse= await cloudinary.uploader.upload(fileUri); 
        }
        const user = await User.findById(userId).select("-password"); 
        if(!user)
            return res.status(404).json({
        success : false,
        message : "user not found"
        })
        if(bio){
            user.bio = bio;
        }
        if(gender){
            user.gender = gender;
        }
        console.log("befor profilePicture")
        if(profilePicture){
            console.log("coming inside profile picture")
            user.profilePic = cloudResponse.secure_url ;
        }
        console.log("after profile pic");
        await user.save();
        return res.status(200).json({
            success : true,
            message : "Profile updated",
            user
        }) 
    } catch (error) {
        console.log("Error in edit profile");
    }
}

export const getSuggestedUser = async(req,res) =>{
    try {
        const suggeestedUsers = await User.find({
            _id : { $ne : req.id }
        }).select("-password");
        if(!suggeestedUsers)
            res.status(400).json({
                message : "Currently do not have any users "
        })
        return res.status(200).json({
            success : true,
            users : suggeestedUsers
        })

    } catch (error) {
        
    }
}

export const followOrUnfollow = async(req,res)=>{
    try {
        const followKrneWaala = req.id; // ayush
        const jiskoFollowKrunga = req.params.id; // sohan
        if(followKrneWaala === jiskoFollowKrunga){
            return res.status(400).json({
                success : false,
                message : "You can't follow unfollow yourself"
            })
        }
        const user = await User.findById(followKrneWaala);
        const targetUser = await User.findById(jiskoFollowKrunga);
        if(!user || !targetUser)
            return res.status(400).json({
        success : false,
        message : "User not found"
        })
        // checking logic to whether follow or unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if(isFollowing){
            // follow logic
            await Promise.all([
                User.updateOne({_id : followKrneWaala },{$pull : {following : jiskoFollowKrunga}}),
                User.updateOne({_id : jiskoFollowKrunga},{$pull : {follower : followKrneWaala} })
            ])
            return res.status(200).json({
                success : false,
                message : "unfolllow successfully"
            })

        }else{
            // unfollow logic 
            await Promise.all([ 
                User.updateOne({_id : followKrneWaala},{$push : {following : jiskoFollowKrunga}}),
                User.updateOne({_id : jiskoFollowKrunga},{$push : {follower : followKrneWaala}})
             ])
             return res.status(200).json({
                success : true,
                message : "followed successfully"
             })
        }

        
    } catch (error) {
        console.log("Error")
    }
}