import { clientServer } from "@/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export const getAllPosts=createAsyncThunk(
     "post/getAllPosts",
     async (_,thunkAPI)=>{
          try {
               const res=await clientServer.get("/posts")
               return thunkAPI.fulfillWithValue(res.data)
          } catch (error) {
               return thunkAPI.rejectWithValue(error.res.data)
          }
     }
)


export const createPost=createAsyncThunk(
     "/post/createPost",
     async (userData,thunkAPI)=>{
               const {file,body}=userData;

          try {
               const formData=new FormData();
               formData.append("token",localStorage.getItem("token"))
               formData.append("body",body)
               formData.append("media",file)
               const res=await clientServer.post("/post",formData,{
                    headers:{
                         "content-Type":"multipart/form-data"
                    }
               })
               if(res.status===200){
                    return thunkAPI.fulfillWithValue("post uploaded")
               }else{
                    return thunkAPI.rejectWithValue("post not uploaded")
               }
               
          } catch (error) {
               return thunkAPI.rejectWithValue("someThing went wrong")
          }
     }
)


export const deletePost=createAsyncThunk(
     "post/postDelete",
     async (post_id,thunkAPI)=>{
          try {
               const res=await clientServer.delete('/post_delete',{
                    data:{
                         token:localStorage.getItem("token"),
                         post_id:post_id ////// .post_id another
                   
                    }
               })
               return thunkAPI.fulfillWithValue(res.data)
          } catch (error) {
               return thunkAPI.rejectWithValue("something went wrong")
          }
          
     }
)



export const incrementPostLike=createAsyncThunk(
     "post/like",
     async (post,thunkAPI)=>{
          try {
               const res=await clientServer.post('/like',{
                    // data:{
                    //      token:localStorage.getItem("token"),
                    //      post_id:post_id ////// .post_id another
                   
                    // }

                    post_id:post.post_id
               })
               return thunkAPI.fulfillWithValue(res.data)
          } catch (error) {
               return thunkAPI.rejectWithValue("something went wrong like")
          }
          
     }
)



export const getAllComments=createAsyncThunk(
     "post/getAllComments",
     async (postData,thunkAPI)=>{
          try {
               const res=await clientServer.get('/get_comments',{
                    // data:{
                    //      token:localStorage.getItem("token"),
                    //      post_id:post_id ////// .post_id another
                   
                    // }

                  params:{
                      post_id:postData.post_id 
                  }
               })
               return thunkAPI.fulfillWithValue({comments:res.data,
                    post_id:postData.post_id
               })
          } catch (error) {
               return thunkAPI.rejectWithValue("something went wrong like")
          }
          
     }
)


export const postComment=createAsyncThunk(
     "post/postComments",
     async (commentsData,thunkAPI)=>{
          try {
               const res=await clientServer.post('/comment',{
                    // data:{
                    //      token:localStorage.getItem("token"),
                    //      post_id:post_id ////// .post_id another
                   
                    // }

                    token:localStorage.getItem("token"),
                    post_id:commentsData.post_id,
                    commentBody:commentsData.body
               })
               return thunkAPI.fulfillWithValue(res.data)
          } catch (error) {
               return thunkAPI.rejectWithValue("something went wrong like")
          }
          
     }
)