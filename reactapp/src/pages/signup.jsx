import { React,useRef, useState,useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '../firebase';
import { collection,query,where,doc,setDoc,getCountFromServer } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate()
  const emailRef=useRef();
  const userNameRef=useRef();
  const passwrdRef=useRef();
  const confirmpasswrdRef=useRef();
  const [err,setErr]=useState(``);
  const [loading,setLoading]=useState(false);
  const {dispatch} = useAuth();

  async function CreateUser(){
    if(passwrdRef.current.value!==confirmpasswrdRef.current.value){
      alert(`Passwords dont match`)
      return
    }
    if(userNameRef.current.value.length<3){
      alert(`Username too small`)
      return
    }
    setLoading(true)
    try{
      const coll = collection(db, "Users");
      const q = query(coll, where("name", "==", userNameRef.current.value));
      const snapshot = await getCountFromServer(q);
      if(snapshot.data().count!==0){
        alert(`Username Exists`)
        setLoading(false)
        return
      } 
      const res = await createUserWithEmailAndPassword(auth,emailRef.current.value,passwrdRef.current.value)
      const user = res.user;
      dispatch({type:"LOGIN",payload:{uid:user.uid}})
      console.log(user)
      await setDoc(doc(db,'Users',user.uid),{
        name: userNameRef.current.value,
        pic: `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.uid}`,
        Quizes:[]
      })
      alert("Created")
      navigate("/home")
    }
    catch(e){
      console.log(e.message)
      alert(`Failed to create account`)
    }
    setLoading(false)
  }
  return (
    <>
    <div className='flex justify-center items-center h-screen'>
      <div className="px-4 py-6 space-y-6 md:px-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your information to create an account</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              
            >
              Usename
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="username"
              placeholder="xyz"
              required=""
              type="username"
              ref={userNameRef}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              
            >
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              placeholder="m@example.com"
              required=""
              type="email"
              ref={emailRef}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              
            >
              Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              required=""
              type="password"
              ref={passwrdRef}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              
            >
              Confirm Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="confirm-password"
              required=""
              type="password"
              ref={confirmpasswrdRef}
            />
          </div>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            onClick={()=>{CreateUser()}}
            disabled={loading}
          >
            Sign Up
          </button>
          <div>
            Already have an account <Link to='/login'>Log In</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}


