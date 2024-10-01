import React from 'react'
import Post from './Post'

const Posts = () => {
  return (
    <div>
       {
        [1,2,3,4,5].map((item,idx)=>{
            return <Post key={idx} />
        })
       }
    </div>
  )
}

export default Posts
