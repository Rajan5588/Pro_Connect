import DashboardLayout from "@/Layout/DashboardLayout";
import UserLayout from "@/Layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "../../config/redux/action/authAction";
import styles from "./index.module.css";
import { Bash_URL, clientServer } from "../../config";
import { getAllPosts } from "../../config/redux/action/postAction";
 const profile = () => {
  const dispatch = useDispatch();

// const [userProfile,setUserProfile]=useState({
//   userId:{
//     name:"",
//     username:"",
//     profilePicture:""
//   },
//   bio:"",
//   pastWork:[]
// })
const [userProfile,setUserProfile]=useState({})
const [userPosts,setUserPosts]=useState([])
const authState =useSelector((state)=>state.auth)
     const postReducer=useSelector((state)=>state.postReducer)

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts())
  }, []);



  useEffect(()=>{

if(authState.user !=undefined){
  setUserProfile(authState.user)
     let post=postReducer.posts.filter((post)=>{
                return post.userId.username=== authState.user.userId.username

          })
          setUserPosts(post)
}

          
  },[authState.user,postReducer.posts])

     const updateProfilePicture=async(file)=>{
      const formData=new FormData()
      formData.append("token",localStorage.getItem("token"))


      formData.append("profile_picture",file)
       
      const res=await clientServer.post("/update_profile_picture",formData,{
        headers:{
          "Content-Type":"multipart/form-data",
        },
      })
       dispatch(getAboutUser({token:localStorage.getItem("token")}))
 }
  
  const updateProfileData=async()=>{
       const req=await clientServer.post("/user_update",{
                 token:localStorage.getItem("token"),
                 name:userProfile.userId.name
       })



       const res=await clientServer.post("/update_profile_data",{
             token:localStorage.getItem("token"),
             bio:userProfile.bio,
             currentPost:userProfile.currentPost,
             pastWork:userProfile.pastWork,
             education:userProfile.education
       })
       dispatch(getAboutUser({token:localStorage.getItem("token")}))
  }



  return (
    <UserLayout>
      <DashboardLayout>
 {authState.user &&userProfile.userId &&
 <div>
      <div className={styles.container} >
          <div   className={styles.backDropContainer}>
       
          <label htmlFor="profilePictureUpload" className={styles.backDrop_overlay}>
            <p>edit</p>
          </label>
          <input onChange={(e)=>updateProfilePicture(e.target.files[0])}  type="file" id="profilePictureUpload" hidden />
             <img
            
              src={`${Bash_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
   
         </div>
          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "1.2rem",
                  }}
                >
               <input type="text" className={styles.nameEdit} value={userProfile.userId.name}onChange={(e)=>{
                setUserProfile({...userProfile,userId:{...userProfile.userId ,name:e.target.value}})
               }} />
                  <p style={{ color: "grey" }}>{userProfile.userId.username}</p>
                </div>
              </div>
            </div>
          <textarea onChange={(e)=>setUserProfile({...userProfile,bio:e.target.value})} value={userProfile.bio} rows={Math.max(3,Math.ceil(userProfile.bio.length /80))}  style={{resize:"none"}}   name="" id=""></textarea>

            <div style={{ flex: "0.2" }}>
              <h3>Recent Activity</h3>
              {userPosts.map((post) => {
                return (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card_profileContainer}>
                        {post.media !== "" ? (
                          <img src={`${Bash_URL}/${post.media}`} />
                        ) : (
                          <div
                            style={{ width: "3.4rem", height: "3.4rem" }}
                          ></div>
                        )}
                      </div>
                      <p>{post.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.workHistory}>
          <h4>Work History</h4>
          <div className={styles.workHistoryContainer}>
            {userProfile.pastWork.map((work, indx) => {
              return (
                <div key={indx} className={styles.workHistoryCard}>
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    {work.company}-{work.position}
                  </p>
                  <p>{work.year}</p>
                </div>
              );
            })}
          </div>
        </div>
        {
          userProfile !=authState.user &&
          <div onClick={updateProfileData} className={styles.connetionButton}>
            Update Profile
          </div>
        }
         </div>
        }
     
      </DashboardLayout>
    </UserLayout>
  );
};

export default profile;