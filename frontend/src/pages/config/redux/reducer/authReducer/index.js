import { getAboutUser, getAllUsers, getConnectionRequest, getMyConnectionRequests, loginUser } from "../../action/authAction"
import { registerUser } from "../../action/authAction"
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     user:undefined,
     isLoading:false,
     isError:false,
     isSuccess:false,
     loggedIn:false,
     message:"",
     isTokenThere:false,
     profileFetched:false,
     connections:[],
     connectionRequests:[],
     all_users:[],
     all_profiles_fetched:false


}

const authSlice= createSlice(
     {
          name:"auth",
          initialState,
          reducers:{
               reset:()=>initialState,
               handleLoginUser:(state)=>{
                   state.message="Logging in user..."

               },
               emptyMessage:(state)=>{
                    state.message=" "
               },
               setTokenIsThere:(state)=>{
                    state.isTokenThere=true
               },
               setTokenIsNotThere:(state)=>{
                    state.isTokenThere=false
               }
          },

          extraReducers:(builder )=>{
               builder.addCase(loginUser.pending,(state)=>{
                    state.isLoading=true;
                    state.message="knocking the user..."
               })
               .addCase(loginUser.fulfilled,(state,action)=>{
                    state.isLoading=false;
                    state.isSuccess=true;
                    state.isError=false;
                    state.loggedIn=true;
                  state.message = "User logged in successfully"; 
                    
               })
               .addCase(loginUser.rejected,(state,action)=>{
                    state.isLoading=false;
                    state.isError=true;
                    state.isSuccess=false;
                    state.loggedIn=false;
                    state.message=action.payload;
               })
               .addCase(registerUser.pending,(state)=>{
                    state.isLoading=true;
                    state.message="Registering the user..."
               }).addCase(registerUser.fulfilled,(state,action)=>{
                    state.isLoading=false;
                    state.isSuccess=true;
                    state.isError=false;
                    state.loggedIn=true;
                     state.message = "User registered successfully, please login to continue"; 
               }).addCase(registerUser.rejected,(state,action)=>{
                    state.isLoading=false;
                    state.isError=true;
                    state.isSuccess=false;
                    state.loggedIn=false;
                    state.message=action.payload;
               }).addCase(getAboutUser.fulfilled,(state ,action)=>{
                    state.isLoading=false
                    state.isError=false
                    state.profileFetched=true
                    state.user=action.payload.profile
                 
               })
               .addCase(getAllUsers.fulfilled,(state,action)=>{
                    state.isLoading=false;
                    state.isError=false;
                    state.all_profiles_fetched=true
                    state.all_users=action.payload.profiles
               }).addCase(getConnectionRequest.fulfilled,(state,action)=>{
                    state.connections=action.payload
               }).addCase(getConnectionRequest.rejected,(state,action)=>{
                    state.message=action.payload
               }).addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
                    state.connectionRequests= Array.isArray(action.payload)
    ? action.payload
    : [];
               }).addCase(getMyConnectionRequests.rejected,(state,action)=>{
                    state.message=action.payload
                     state.connectionRequests = []
               })
          }
     }


)

  export const {reset,emptyMessage,setTokenIsThere,setTokenIsNotThere}=authSlice.actions
export default authSlice.reducer;