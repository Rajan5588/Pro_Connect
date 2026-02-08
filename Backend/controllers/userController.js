import User from "../models/userModel.js"
import Profile from "../models/profileModel.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import PDFDocument from "pdfkit";
import fs from "fs"
import ConnectionRequest from "../models/connectionModel.js"
import path from "path";
const convertUserDataToPDF=async(userData)=>{



     const doc=new PDFDocument();
      const fileName = crypto.randomBytes(32).toString("hex") + ".pdf";
//       const stream=fs.createWriteStream("/uploads"+outputPath)
//       doc.pipe(stream)
//       doc.image(`/uploads/${userData.userId.profilePicture}`,{align:"center",width:100})


//  doc.fontSize(14).text(`Name: ${userData.userId.name}`)
//      doc.fontSize(14).text(`Username: ${userData.userId.username}`)
//      doc.fontSize(14).text(`Email: ${userData.userId.email}`)
//      doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`)
//      doc.fontSize(14).text(`Current Position: ${userData.currentPost|| "N/A"}`)

//      doc.fontSize(14).text(`Past Work: `)
//      userData.pastWork?.forEach((work,index)=>{
//           doc.fontSize(12).text(`Company: ${work.company || "N/A"}`)
//           doc.fontSize(12).text(`Postion: ${work.positon || "N/A"}`)
//           doc.fontSize(12).text(`Year: ${work.years|| "N/A"}`)
               
//       })
  const uploadsDir = path.join(process.cwd(), "uploads");

  const outputPath = path.join(uploadsDir, fileName);
      if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

     const stream=fs.createWriteStream(outputPath);
     doc.pipe(stream);
     console.log("userData",userData)
     doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center",width:100})
     doc.fontSize(14).text(`Name: ${userData.userId.name}`)
     doc.fontSize(14).text(`Username: ${userData.userId.username}`)
     doc.fontSize(14).text(`Email: ${userData.userId.email}`)
     doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`)
     doc.fontSize(14).text(`Current Position: ${userData.currentPost|| "N/A"}`)

     doc.fontSize(14).text(`Past Work: `)
     userData.pastWork?.forEach((work,index)=>{
          doc.fontSize(12).text(`Company: ${work.company || "N/A"}`)
          doc.fontSize(12).text(`Postion: ${work.positon || "N/A"}`)
          doc.fontSize(12).text(`Year: ${work.years|| "N/A"}`)

               
     })
     doc.end();
  
     return outputPath;

}
    export const register=async(req,res)=>{
     try {
          const {name,username,email,password}=req.body;
      if(!username || !name || !email || !password){
    return res.status(400).json({message:"All fields are required"});
}

          const user=await User.findOne({email})
          if(user){
               return res.status(400).json({message:"user already existed"})
          }
            
      const hashPassword=await bcrypt.hash(password,10);
      const newUser=new User({
          name,
          username,
          email,
          password:hashPassword
      })
      await newUser.save();
      const profile=new Profile({userId:newUser._id})
        await profile.save()
      return res.status(201).json({message:"user registered successfully"})

     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}

export const login=async(req,res)=>{

     try {
          const {email,password}=req.body;
          
          if(!email || !password){
               return res.status(400).json({message:"All fields are required"});
          }
          const user=await User.findOne({email})
          if(!user){
               return res.status(400).json({message:"user does not exist"})
          }  

          const isMatch=await bcrypt.compare(password,user.password)
          if(!isMatch){
               return res.status(400).json({message:"password is incorrect"})
          }
          const token =crypto.randomBytes(16).toString("hex");
          await User.updateOne({_id:user._id},{$set:{token}});
          
          return res.status(200).json({message:"login successful",token})
     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}

 export const uploadProfilePicture=async(req,res)=>{
     const {token}=req.body;
     try {
          const  user=await User.findOne({token})
          if(!user){
               return res.status(400).json({message:"user not found"})
          }
          const profile=await Profile.findOne({userId:user._id})
          if(!profile){
               return res.status(400).json({message:"profile not found"})
          }
         user.profilePicture=req.file.filename;
           await user.save();
          return res.status(200).json({message:"profile picture updated successfully"})
     } catch (error) {
          res.status(500).json({message:error.message})
     }
}


export const updateUserProfilePicture=async(req,res)=>{
     try {
          const {token,...newUserData}=req.body;
            const {username,email,name}=newUserData;
          console.log("token",token)
          const user=await User.findOneAndUpdate({token},{name});
          if(!user){
               return res.status(400).json({message:"user not found"})
          }
     //      const {username,email,name}=newUserData;
     //      console.log(name)
     //      const existingUser=await User.findOne({$or:[{username},{email},{name}]});
     //   if(existingUser){
     //      if(existingUser._id.toString() !== user._id.toString()){
     //           return res.status(400).json({message:"username or email already in use"})
     //      }
     //   }
     //      object.assign(user,newUserData);
     //      await user.save();
          return res.status(200).json({message:"profile picture updated successfully"})
     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}

export const getUserAndProfile=async(req,res)=>{
     try {
          const {token}=req.query;
      
          const user=await User.findOne({token});
          if(!user){
               return res.status(400).json({message:"user not found"})
          }
          const profile=await Profile.findOne({userId:user._id}).populate("userId", "name email username profilePicture");
          console.log(" profile",profile      )
          if(!profile){
               return res.status(400).json({message:"profile not found"})
          }
          return res.status(200).json({"profile":profile})
     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}

export const updateProfileData=async(req,res)=>{
     try {
          const {token,...newProfileData}=req.body;
            ;   // ✅ yahan file object aa raha hai

            const {  bio,
  currentPost,
  pastWork,
  education}=req.body


          const userProfile=await User.findOne({token})
          if(!userProfile){
               return res.status(400).json({message:"user not found"})
          }
          const profile_to_update=await Profile.findOneAndUpdate({userId:userProfile._id},{bio})
          console.log(profile_to_update,"1")
         
          await profile_to_update.save();
          return res.status(200).json({message:"profile updated successfully"})
          
     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}



export const getAllUserProfile=async(req,res)=>{
     try {
        const profiles=await Profile.find().populate("userId","name username email profilePicture");  
            return res.status(200).json({profiles})
     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}


export const downloadProfile=async(req,res)=>{
     try {

     const user_id=req.query.id;
     
      if (!user_id) {
      return res.status(400).json({ message: "User id is required" });
    } //trc
          const userProfile=await Profile.findOne({userId:user_id}).populate("userId","name username email profilePicture ");
console.log("USER ID 👉", user_id);
console.log("PROFILE 👉", userProfile);
          let outputPath= await convertUserDataToPDF(userProfile); 
          // uper banya hu 

            res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=profile.pdf"
    );
        
    return res.json({message:outputPath});
     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}


export const sendConnectionRequest=async(req,res)=>{
     try {
         const {token,connectionId}=req.body;
         
   

           const user=await User.findOne({token});
          if(!user){
               return res.status(400).json({message:"user not found"})
          }
          const connectionUser=await User.findById({_id:connectionId});
          if(!connectionUser){
               return res.status(400).json({message:"connection user not found"})
          }
          //logic to send connection request
          const existingRequest=await ConnectionRequest.findOne({userId:user._id,connectionId:connectionUser._id});
          if(existingRequest){
               return res.status(400).json({message:"connection request already sent"})
          }
          const request=new ConnectionRequest({
               userId:user._id,
               connectionId:connectionUser._id
          })
          await request.save();
          return res.status(200).json({message:"connection request sent successfully"})
     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}

export const getMyConnectionRequests=async(req,res)=>{
     try {
          const {token}=req.query;
          const user=await User.findOne({token})
          if(!user){
               return res.status(400).json({message:"user not found"})

          }
          const connections=await ConnectionRequest.find({userId:user._id}).populate("userId","name username email profilePicture");
          return res.status(200).json({connections})


          
     } catch (error) {
          return res.status(500).json({message:error.message})
          
     }
}


export const whatAreMyConnections=async(req,res)=>{
     try {
          const {token}=req.query;
          const user=await User.findOne({token})
          if(!user){
               return res.status(400).json({message:"user not found"})
          }
          const connections=await ConnectionRequest.find({connectionId:user._id}).populate("userId","name username email profilePicture");
          return res.status(200).json({connections})
     } catch (error) {
          return res.status(500).json({message:error.message})
     }
}


export const acceptConnectionRequest=async(req,res)=>{
          const {token,requestId,action_type}=req.body;

     try {

          const user=await User.findOne({token});
          if(!user){
               return res.status(400).json({message:"user not found"})
          }
          const connection=await ConnectionRequest.findById({_id:requestId});
          if(!connection){
               return res.status(400).json({message:"connection request not found"})
          }
          // if(connection.connectionId.toString()!==user._id.toString()){
          //      return res.status(400).json({message:"you are not authorized to accept this request"})
          // }
          if(action_type==="accept"){
               connection.status_accepted=true;
     
          }else{
               connection.status_accepted=false;
          }

          await connection.save();
          return res.status(200).json({message:"connection request processed successfully"})

     } catch (error) {
          return res.status(500).json({message:error.message})
          
     }
}