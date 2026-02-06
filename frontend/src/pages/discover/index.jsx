import DashboardLayout from '@/Layout/DashboardLayout'
import UserLayout from '@/Layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../config/redux/action/authAction'
import { Bash_URL } from '../config'
import styles from "./index.module.css"
import { useRouter } from 'next/router'

const Discover = () => {

const authState=useSelector((state)=>state.auth)
const dispatch=useDispatch()
const router=useRouter()
  useEffect(()=>{
if(!authState.all_profiles_fetched){
dispatch(getAllUsers())
}
  },[])
  return (
    <UserLayout>
   <DashboardLayout>
     <div>

      <div className={styles.allUserProfile}>
        <h1>Discover</h1>
        {
  authState.all_profiles_fetched && authState.all_users.map((user)=>{
    return (
      <div onClick={()=>{
router.push(`/view_profile/${user.userId.username}`)
      }} key={user._id} className={styles.userCard}>
      <img className={styles.userCard_image} src={`${Bash_URL}/${user.userId.profilePicture}`} alt="" />
   <div>
       <h1>{user.userId.name}</h1>
      <p>{user.userId.username}</p>
   </div>
      </div>
    )
  })
        }
      </div>
     </div>
   </DashboardLayout>
    </UserLayout>
  )
}

export default Discover