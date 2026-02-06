import authReducer from "./reducer/authReducer";
import PostReducer from "./reducer/postReducer"
const { configureStore } = require("@reduxjs/toolkit");

 export const store=configureStore({
     reducer:{
        auth:authReducer,
        postReducer:PostReducer

     }
})