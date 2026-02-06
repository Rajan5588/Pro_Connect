import UserLayout from '@/Layout/UserLayout'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css'
import { loginUser, registerUser } from '../config/redux/action/authAction';
import { emptyMessage } from '../config/redux/reducer/authReducer';

const loginComponent = () => {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [userLoginMethod, setUserLoginMethod]=useState(false);



const [name, setName]=useState("")
const [email, setEmail]=useState("")
const [password, setPassword]=useState("")
const [username, setUsername]=useState("")



  const dispatch = useDispatch();
  useEffect(() => {
    if(authState?.loggedIn && localStorage.getItem("token")){
      router.push('/dashboard')
    }
  },[authState?.loggedIn])

  useEffect(()=>{
 dispatch(  emptyMessage());
  },[userLoginMethod])

useEffect(()=>{
  if(localStorage.getItem("token")){
      router.push('/dashboard')

  }
},[])

const hendleRegister=()=>{
  dispatch(registerUser({
    name:name,
    username:username,
    email:email,
    password:password
  
  }))
}
 
const handleLogin=()=>{
  dispatch(loginUser({
    email:email,
    password:password,
  }))

}





  return (
 <UserLayout>


   <div className={styles.container}>
      <div className={styles.cardContainer}>
      <div className={styles.leftCardContainer}>
        <p>
          {userLoginMethod ? "Login" : "Register"}
        </p>
{    
authState.message&&(<p className={styles.errorMessage} style={{color:authState.isError?"red":"green", fontSize:"16px"}}>{authState.message}</p>)
 
 }
        <div className={styles.inputContainer}>
       {
        !userLoginMethod&&(   <div className={styles.inputRow}>
            <input type=" text"  onChange={(e)=>setUsername(e.target.value)}   value={username}  name='username' className={styles.inputField} placeholder='username'/>
            <input type=" text"   onChange={(e)=>setName(e.target.value)}     value={name}  name='name' className={styles.inputField} placeholder='name'/>

          </div>)
       }
            <input type=" text"   onChange={(e)=>setEmail(e.target.value)}     value={email}  name='email' className={styles.inputField} placeholder='email'/>
            <input type="password"   onChange={(e)=>setPassword(e.target.value)}     value={password}  name='password' className={styles.inputField} placeholder='password'/>
             <div className={styles.btnOutline} onClick={()=>{
              if(!userLoginMethod){
                hendleRegister()
           
              }else{
                handleLogin()
              }
             }}>
              {userLoginMethod ? "Login" : "Register"}
             </div>
        </div>
      </div>
      <div className={styles.rightCardContainer}>
            <div>
      {userLoginMethod? <p> dont have an Account? </p>: <p>have an Account? </p>}
      <div className={styles.btnOutline} onClick={()=>{
      setUserLoginMethod(!userLoginMethod)
      }} style={{color:"black",alignItems:"center",textAlign:"center", marginTop:"20px"}}>{userLoginMethod ? "Register" : "Login"}</div>

     </div>
      </div>
 
    </div>
   </div>
 </UserLayout>
  ) 
}


export default loginComponent