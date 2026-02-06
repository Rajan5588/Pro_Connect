import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import dotenv from "dotenv";
import path from "path"
dotenv.config();



const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
// Static serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT =process.env.PORT || 5000;


app.use(userRoutes)
app.use(postRoutes)
app.use(express.static("uploads"))


const start=async()=>{
    const connectDB= await mongoose.connect(process.env.MONGO_URI)
     console.log("MongoDB connected:",connectDB.connection.host);

     app.listen(PORT,()=>{
         console.log(`Server is running on port ${PORT}`);
     })
}

start()