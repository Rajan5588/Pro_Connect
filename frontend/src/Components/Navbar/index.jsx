import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { reset } from '@/config/redux/reducer/authReducer'
const Navbar = () => {
     const router=useRouter()
     const dispatch=useDispatch()
     const authState=useSelector((state)=>state.auth)
  return (
    <div className={styles.container}>
     <nav className={styles.navBar}>
       <div className={styles.navLeft}>
           <h1
           onClick={()=>{
               router.push("/")
           }}
           >Pro Connect</h1>
            </div>
         <div className={styles.navRight}>

            {
               authState.profileFetched &&(
                  <div style={{display:"flex", gap:'1.2rem', alignItems:"center"}}>
               {/* hey<p>{authState?.user?.userId.name}</p>  */}
            <p onClick={()=>{
               router.push("/profile")
            }} style={{fontWeight:"bold" , cursor:"pointer"}}>profile</p>
            <p onClick={()=>{
               localStorage.removeItem("token")
               router.push("/login")
               dispatch(reset())
            }} style={{fontWeight:"bold" , cursor:"pointer"}}>Logout</p>

            </div>
               )
            }


            {
               !authState.profileFetched && 
               <div
          onClick={()=>{
             router.push("/login")
          }}
          className={styles.buttonjoin}>
             <p>Be a part</p>
          </div>
            }
          
        
       </div>
     </nav>
    </div>
  )
}

export default Navbar