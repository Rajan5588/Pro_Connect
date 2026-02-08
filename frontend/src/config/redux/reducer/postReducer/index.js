
import { createSlice } from "@reduxjs/toolkit";
import { getAllComments, getAllPosts, incrementPostLike } from "../../action/postAction";

const initialState={
     posts:[],
       isLoading:false,
     isError:false,
     postFetched:false,
     isSuccess:false,
     loggedIn:false,
     message:"",
      comments:[],
      postId:""

}


const PostSlice=createSlice({
     name:"post",
     initialState,
     reducers:{
          reset:()=>initialState,
          resetPostId:(state)=>{
               state.postId=""
          },

     },
     extraReducers:(builder)=>{
builder.addCase(getAllPosts.pending,(state)=>{
     state.isLoading=true
     state.isError=false
     state.message="Fetching all posts...."
}).addCase(getAllPosts.fulfilled,(state,action)=>{
     state.isLoading=false
     state.isError=false
     state.postFetched=true
     state.posts=action.payload.posts.reverse()
}).addCase(getAllPosts.rejected,(state,action)=>{
     state.isLoading=false
     state.isError=false
     state.message=action.payload
}).addCase(getAllComments.fulfilled,(state,action)=>{
     
    state.postId = action.payload.post_id;
    state.comments=action.payload.comments
}).addCase(incrementPostLike.fulfilled, (state, action) => {
  state.posts = state.posts.map((p) =>
     p._id === action.payload.post._id
      ? action.payload.post
      : p
  );
});
     }
})

  export const {resetPostId}=PostSlice.actions

export default PostSlice.reducer;