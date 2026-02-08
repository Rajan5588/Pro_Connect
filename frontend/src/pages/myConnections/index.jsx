import DashboardLayout from '@/Layout/DashboardLayout'
import UserLayout from '@/Layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acceptConnection, getConnectionRequest, getMyConnectionRequests } from '../../config/redux/action/authAction'
import { Bash_URL } from '../../config'
import styles from "./index.module.css"
import { useRouter } from 'next/router'

const MyConnections = () => {

const dispatch=useDispatch()
const authState=useSelector((state)=>state.auth)
const router=useRouter()

useEffect(()=>{
dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))
  dispatch(getConnectionRequest({ token :localStorage.getItem("token")}))
console.log(authState.connectionRequests,"connection")
console.log(localStorage.getItem("token"))
},[])

useEffect(()=>{
if(authState.connectionRequests.length !=0){
  console.log(authState.connectionRequests,"connection")
  console.log(authState.connectionRequests.length,"connection")
}

},[authState.connectionRequests])


  return (
    <UserLayout>
   <DashboardLayout>
    <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>
       <h2>MyConnections</h2>

{authState.connectionRequests.length===0 &&<h3>No connection  request</h3>  }

        {authState.connectionRequests.length !=0 && authState.connectionRequests.filter((connection)=>connection.status_accepted===null).map((user)=>{
        return(
          <div onClick={()=>{
router.push(`/view_profile/${user.userId.username}`)
          }} key={user._id} className={styles.userCard}>
    
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}  >
  <div className={styles.userProfile}>
            <img src={`${Bash_URL}/${user.userId.profilePicture}`} alt="" />
           
  </div>
  <div className={styles.userInfo}>
    <h3>{user.userId.name}</h3>
    <p>{user.userId.username}</p>
  </div>
<div style={{float:"right",right:"1", marginLeft:"3rem"}}>   <button onClick={(e)=>{
e.stopPropagation()
dispatch(acceptConnection({
  connectionId:user._id,
  token:localStorage.getItem("token"),
  action:"accept"
}))
   }} className={styles.connectedButton} >Accept</button></div>
</div>

            
          </div>
        )
       })} 

<h4>My Network</h4>
{authState.connectionRequests.map((user)=><p>{user._id}</p>)}
      { authState.connectionRequests.filter((connection)=>connection.status_accepted!==null).map((user)=>{
        return(
          
          <div onClick={()=>{
router.push(`/view_profile/${user.userId.username}`)
          }} key={user._id} className={styles.userCard}>
    
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}  >
  <div className={styles.userProfile}>
            <img src={`${Bash_URL}/${user.userId.profilePicture}`} alt="" />
           
  </div>
  <div className={styles.userInfo}>
    <h3>{user.userId.name}</h3>
    <p>{user.userId.username}</p>
  </div>
   
</div>

            
          </div>
        )
      })}
    </div>
   </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnections;
