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
    setLoading(true)
    if(passwrdRef.current.value!==confirmpasswrdRef.current.value){
      setErr("Passwords Dont Match")
      return
    }
    if(userNameRef.current.value.length<3){
      setErr('Username too small')
      return
    }
    
    if(passwrdRef.current.value<6){
      setErr('Password too small')
      return
    }
    try{
      setErr('')
      const coll = collection(db, "Users");
      const q = query(coll, where("name", "==", userNameRef.current.value));
      const snapshot = await getCountFromServer(q);
      if(snapshot.data().count!==0){
        setErr(`Username Already Exists`)
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
      setErr(`Failed to create account`)
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
              placeholder='Password...'
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
              placeholder='Confirm...'
              ref={confirmpasswrdRef}
            />
          </div>
          <div className='flex justify-center'>
          <button
             className="border border-gray-600 rounded-lg px-2 py-1 text-white bg-black font-semibold shadow-lg hover:shadow-none"
            onClick={()=>{CreateUser()}}
            disabled={loading}
          >
            Sign Up
          </button>
          </div>
          <div className='text-red-900 flex items-center justify-center'>
            {err}
          </div>
          <div className='flex items-center justify-center'>
            Already have an account? <Link to='/login' className='px-2 text-blue-600 underline'>Log In</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}


