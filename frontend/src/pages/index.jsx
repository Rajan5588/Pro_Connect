import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/Layout/UserLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router=useRouter()
  return (
    <UserLayout>
     <div className={styles.container}>
      <div className={styles.mainContainer}>
      
        <div className={styles.leftContainer}>
            <p>connect with friends without exaggeration</p>
        <p>a true social media plateform with stories not bluf.</p>
        <div onClick={()=>{
    router.push("/login")
        }} className={styles.btnjoin}>
          join Now
        </div>
        </div>
        <div className={styles.rightContainer}>
          <img src="images/social.jpg" alt="" />
        </div>
      </div>
     </div>
    </UserLayout>
  );
}
