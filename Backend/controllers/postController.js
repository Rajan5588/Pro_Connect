import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import Comment from "../models/commentsModel.js"
import  Profile from "../models/profileModel.js"
  export const checkActive=async(req,res)=>{
     return res.status(200).json({message:"User is active"})
}


export   const createPost=async(req,res)=>{
  const {token}=req.body
  try {
    const user=await User.findOne({token})
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    const post=new Post({
      userId:user._id,
      body:req.body.body,
      media:req.file!=undefined?req.file.filename:"",
      fileType:req.file!=undefined?req.file.mimetype.split("/")[1]:""
    })
    await post.save()
    return res.status(201).json({message:"Post created successfully",post})
  } catch (error) {
    return res.status(500).json({message:"Server Error"})
  }
}

export const getAllPost=async(req,res)=>{

  try{
    const posts=await Post.find().populate("userId","name email username profilePic") 
    return res.status(200).json({posts})

  }catch(eror){
    return res.status(500).json({message:"Server Error"})
  }
}

export const delatePost=async(req,res)=>{
    const {token ,post_id}=req.body


  try {

    const user=await User.findOne({token}).select("_id")
    if(!user){
      return res.status(404).json({message:"User not found"})

    }
const post=await Post.findOne({_id:post_id.post_id,})

if(!post){
  return res.status(404).json({message:"Post not found"})
}
if(post.userId.toString()!==user._id.toString()){
  return res.status(403).json({message:"You are not authorized to delete this post"})
}
await Post.deleteOne({_id:post_id.post_id})       // delete post
return res.status(200).json({message:"Post deleted successfully"})

  } catch (error) {
    return res.status(500).json({message:"Server Error"})
  }
}

export const commentPost=async(req,res)=>{

  try {
     const {token,post_id,commentBody}=req.body  
      const user=await User.findOne({token}).select("_id ")
      if(!user){
        return res.status(404).json({message:"User not found"})
      }
      const post=await Post.findOne({_id:post_id})
      if(!post){
        return res.status(404).json({message:"Post not found"})
      }
      const comment= new Comment({
        userId:user._id,
        postId:post._id,
        body:commentBody
      })
      await comment.save()
      return res.status(200).json({message:"Comment added successfully",comment})
  } catch (error) {
     
    return res.status(500).json({message:"Server Error"})
  }
}


export const allComments=async(req,res)=>{
  

  try {
    const {post_id}=req.query
    const post=await Post.findOne({_id:post_id})
    if(!post){
      return res.status(404).json({message:"Post not found"})
    }
    const comments=await Comment.find({postId:post_id}).populate("userId","username name")
    return res.status(200).json(comments.reverse())
  } catch (error) {
    return res.status(500).json({message:"Server Error"})
  }
}




export const deleteComment=async(req,res)=>{
  try {
    const {token,post_id,comment_id}=req.body
    const user=await User.findOne({token}).select("_id ")
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    const comment=await Comment.findOne({_id:comment_id})
    if(!comment){
      return res.status(404).json({message:"Comment not found"})
    }
    if(comment.userId.toString()!==user._id.toString()){
      return res.status(403).json({message:"You are not authorized to delete this comment"})
    }
    await Comment.deleteOne({_id:comment._id})
    return res.status(200).json({message:"Comment deleted successfully"})

  } catch (error) {
    return res.status(500).json({message:"Server Error"})
  }
}

export const incrementLikes = async (req, res) => {
  try {
    const { post_id } = req.body;

    const post = await Post.findByIdAndUpdate(
      post_id,
      { $inc: { likes: 1 } }, // ✅ Mongo handles increment
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Like incremented successfully",
      post,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const getUserProfileAndUserBasedOnUsername=async(req,res)=>{
  console.log(req.query.username);

  try {
    const {username}=req.query
    const user=await User.findOne({
      username
    })
    if(!user){
      return res.status(404).json({message:"user not found "})

    }
    const userProfile=await Profile.findOne({userId:user._id}).populate("userId","name username email profilePicture")
    return res.json({"profile":userProfile})
    
  } catch (error) {
    return res.status (500).json({message:"server error "})
  }

}