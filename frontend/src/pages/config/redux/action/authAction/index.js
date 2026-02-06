import { clientServer } from "@/pages/config";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const loginUser=createAsyncThunk(
     "user/login",
     async (user,thunkAPI)=>{
         try {
          const res=await clientServer.post("/login",{
               email:user.email,
               password:user.password
          })
          if(res.data.token){
          localStorage.setItem("token",res.data.token)

          }else{
               return thunkAPI.rejectWithValue("Login failed")
          }
return thunkAPI.fulfillWithValue(res.data.token);
          
         } catch (error) {
          return thunkAPI.rejectWithValue("something went wrong")
         }
     }

)


export const registerUser=createAsyncThunk(
     "user/register",
     async (user,thunkAPI)=>{
          try {
               const res=await clientServer.post("/register",{
                    name:user.name,
                    username:user.username,
                    email:user.email,
                    password:user.password

               })
               
               // if(res.data.token){
               //      localStorage.setItem("token",res.data.token)
               // }
           return thunkAPI.fulfillWithValue("register suceess");
          } catch (error) {
               return thunkAPI.rejectWithValue("something went wrong")
          }
     }
)

export const getAboutUser=createAsyncThunk(
     "user/getAboutUser",
     async (user,thunkAPI)=>{
         try {
             const res=await clientServer.get("/get_user_and_profile",{
             params:{
                 token:user.token
             }
             })
             return thunkAPI.fulfillWithValue(res.data)
         } catch (error) {
          return thunkAPI.rejectWithValue("something went wrong")
         }
     }
)





export const getAllUsers=createAsyncThunk(
     "user/getAllUsers",
     async(_,thunkAPI)=>{
          try {
               const res=await clientServer.get("/user/get_all_users")
               return thunkAPI.fulfillWithValue(res.data) // discover
               
          } catch (error) {
               return thunkAPI.rejectWithValue("something is error ")
          }
     }
)



export const sendConnectionRequest=createAsyncThunk(
     "user/sendConnectionRequest",
     async(user,thunkAPI)=>{
          try {
               const res=await clientServer.post("/user/send_connection_request",{
                         token:user.token,
                         connectionId:user.user_id
                    
               })
   thunkAPI.dispatch(getConnectionRequest({token:user.token}))
               return thunkAPI.fulfillWithValue(res.data)
          } catch (error) {
               return thunkAPI.rejectWithValue("something is Error ",error.res.data.message)
          }
     }
)



export const getConnectionRequest=createAsyncThunk(
     "user/getConnectionRequest",
     async(user,thunkAPI)=>{
          try {
               const res=await clientServer.get("/user/getConnectionRequests",{
                        params:{
                          token:user.token
                        
                        }
               })
   
               return thunkAPI.fulfillWithValue(res.data.connections)
          } catch (error) {
               return thunkAPI.rejectWithValue("something is Error ")
          }
     }
)




export const getMyConnectionRequests=createAsyncThunk(
     "user/getMyConnectionRequests",
     async(user,thunkAPI)=>{
          try {
               const res=await clientServer.get("/user/user_connection_requests",{
                        params:{
                          token:user.token
                        
                        }
               })
         console.log("API RESPONSE 👉", res.data)
               return thunkAPI.fulfillWithValue(res.data.connections)
          } catch (error) {
               return thunkAPI.rejectWithValue("something is Error ")
          }
     }
)

export const acceptConnection=createAsyncThunk(
     "user/acceptConnection",
     async(user,thunkAPI)=>{
          try {
               const res=await clientServer.post("/user/accept_connection_request",{
                   
                          token:user.token,
                  requestId:user.connectionId,
                        action_type:user.action
               })
               thunkAPI.dispatch(getConnectionRequest({token:user.token}))
               thunkAPI.dispatch(getMyConnectionRequests({token:user.token}))
   
               return thunkAPI.fulfillWithValue(res.data)
          } catch (error) {
               return thunkAPI.rejectWithValue("something is Error ")
          }
     }
)
