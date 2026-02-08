import { useSearchParams } from "next/navigation"
import { Bash_URL, clientServer } from "../config";
import DashboardLayout from "@/Layout/DashboardLayout";
import UserLayout from "@/Layout/UserLayout";
import styles from "./index.module.css"
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllPosts } from "../config/redux/action/postAction";
import { getConnectionRequest, getMyConnectionRequests, sendConnectionRequest } from "../config/redux/action/authAction";

export default function ViewProfilePage({userProfile}){
     const searchParamers=useSearchParams();
     const router=useRouter()
     const postReducer=useSelector((state)=>state.postReducer)
     const dispatch=useDispatch()
     const authState=useSelector((state)=>state.auth)
     const [userPosts, setUserPost]=useState([])
     const [isCurrentUserInConnection, setIsCurrentUserInConnection]=useState(false)
     const [isConnectionNull,setIsConnectionNull]=useState(true)
     const getUserPost=async()=>{
          await dispatch(getAllPosts())
          await dispatch(getConnectionRequest({token:localStorage.getItem("token")}))
          await dispatch(getMyConnectionRequests({token:localStorage.getItem("token",)}))

     }

     useEffect(()=>{
          let post=postReducer.posts.filter((post)=>{
                return post.userId.username=== router.query.username

          })

          setUserPost(post)
     },[postReducer.posts])

     useEffect(()=>{
      
         
          if(
            authState.connections&&  
               authState.connections.some(user=>user.connectionId._id===userProfile.userId._id)){
               setIsCurrentUserInConnection(true)
               if(authState.connections.find(user=>user.connectionId._id===userProfile.userId._id).status_accepted===true){
                    setIsConnectionNull(false)
               }
          }
  if(
            authState.connectionRequests&&  
               authState.connectionRequests.some(user=>user.userId._id===userProfile.userId._id)){
               setIsCurrentUserInConnection(true)
               if(authState.connectionRequests.find(user=>user.userId._id===userProfile.userId._id).status_accepted===true){
                    setIsConnectionNull(false)
               }
          }
     },[authState.connections,authState.connectionRequests])

useEffect(() => {
  console.log("👤 Viewing profile:", userProfile.userId._id)
  console.log("🔗 connections:", authState.connections)

  let found = null

  if (authState.connections?.length > 0) {
    found = authState.connections.find(
      c => c.connectionId === userProfile.userId._id
    )
  }

  if (found) {
    setIsCurrentUserInConnection(true)

    // 🔥 yahi main fix hai
    if (found.status_accepted === null) {
      setIsConnectionNull(true)   // pending
    } else {
      setIsConnectionNull(false)  // connected
    }

  } else {
    setIsCurrentUserInConnection(false)
    setIsConnectionNull(true)
  }

}, [authState.connections, userProfile.userId._id])

     useEffect(()=>{
          getUserPost()//getUsersPost()
     },[])




     return(

          <UserLayout>
        <DashboardLayout>
            <div className={styles.container}>
               <div className={styles.backDropContainer}>
                    <img className={styles.backDrop} src={`${Bash_URL}/${userProfile.userId.profilePicture}`} alt="" />

               </div>
               <div className={styles.profileContainer_details}>
                    <div className={styles.profileContainer_flex}>
                         <div style={{flex:"0.8" }}>
                              <div style={{display:"flex",width:"fit-content", alignItems:"center" ,flexDirection:"column",gap:"1.2rem"}}>
                                   <h2>{userProfile.userId.name}</h2>
                                   <p style={{color:"grey",}}>{userProfile.userId.username}</p>
                         </div>
                         <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                              {isCurrentUserInConnection?
                              <button className={styles.connectedButton}>{isConnectionNull?" pending":"connected"}</button>:
                              <button onClick={()=>{
                                   dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id:userProfile.userId._id}))// user_ error hai
                              }} className={styles.connectBtn}>connect</button>
                         }
                         <div onClick={async()=>{
                              const res=await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`)
                                 window.open(`${Bash_URL}/${res.data.message}`,"_blank")
                               
                         }} style={{cursor:"pointer"}}>
                              <svg style={{width:"1em",}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

                         </div>
                         
                         </div>

                              </div>
                              <p>{userProfile.bio}</p>
                              



                         <div style={{flex:"0.2" }}>
                              <h3>Recent Activity</h3>
                             { userPosts.map((post)=>{
                                 return(
                                   <div key={post._id} className={styles.postCard}>
                                        <div className={styles.card}>
                                           <div className={styles.card_profileContainer}>
                                             {post.media !==""? <img src={`${Bash_URL}/${post.media}`} />:<div style={{width:"3.4rem",height:"3.4rem"}}></div>}
                                           </div>
                                         <p>{post.body}</p>
                                        </div>
                                   </div>
                                 )
                              })}
                         </div>

                    </div>
               </div>
<div className={styles.workHistory}>
     <h4>Work History</h4>
     <div className={styles.workHistoryContainer}>
          {
               userProfile.pastWork.map((work,indx)=>{
                    return <div key={indx} className={styles.workHistoryCard}>
                         <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:"0.8rem"}}>{work.company}-{work.position}</p>
                         <p>{work.year}</p>
                    </div>
})
          }
     </div>
</div>
            </div>
        </DashboardLayout>
        </UserLayout>
     )
}


export async function getServerSideProps (context){
     const request= await clientServer.get("/user/get_profile_based_on_username",{
          params:{
               username:context.query.username
          }
     })
     const res= request.data;
return {props:{userProfile:request.data.profile}}
}