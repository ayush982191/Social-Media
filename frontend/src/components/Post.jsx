import React, { useState } from 'react';
import Dialog from './Dialog';
import img1 from '../assets/img1.jpg'; // Importing the image
import { FaRegHeart } from "react-icons/fa";
import { BiSend } from 'react-icons/bi';
import { LuBookMarked, LuMessageCircle } from 'react-icons/lu';
import CommentDialog from './CommentDialog';

const Post = () => {
  const [text,setText] = useState("");
  const [open,setOpen] = useState(false)
  const changeEventHandler = (e) =>{
    // setText(e.target.value)
    const inputText = e.target.value;
    if(inputText.trim())
      setText(inputText)
    else 
      setText(""); 
  }



  return (
    <div className="my-8 w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Left section with text */}
        <div className="flex items-center gap-2">
          <p className="text-base md:text-lg font-medium text-gray-700">This is p1</p>
        </div>

        {/* Right section with Dialog (Button to toggle modal) */}
        <div>
          <Dialog />
        </div>
      </div>

      {/* Post Image */}
      <div>
        <img
          src={img1}
          alt="Post Image"
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Post Action Icons */}
      <div className="flex justify-between items-center mt-4 px-2 md:px-4">
        <div className="flex space-x-4">
          <FaRegHeart className="text-xl cursor-pointer hover:text-red-600 transition" />
          <LuMessageCircle onClick={()=>setOpen(true)} className="text-xl cursor-pointer hover:text-blue-600 transition" />
          <BiSend className="text-xl cursor-pointer hover:text-green-600 transition" />
        </div>
        <LuBookMarked className="text-xl cursor-pointer hover:text-yellow-600 transition" />
      </div>
      <span>1000 likes</span>
      <p>
        <span>username</span>
        {
            "caption"
        }
      </p>
      <span onClick={()=>setOpen(true)}>View all 10 comments</span>
      <div  >
      <CommentDialog open={open} setOpen={setOpen} />
      </div>
      <div>
        <input type="text" onChange={changeEventHandler}  placeholder='Add a comment'  />
        {
          text && <span>Post</span>
        }
      </div>
    </div>
  );
};

export default Post;
