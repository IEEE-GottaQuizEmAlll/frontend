import { React,useEffect,useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [displayErr,setDisplayErr] = useState('')
  const navigate  = useNavigate()
  const emailRef=useRef();
  const passwrdRef=useRef();
  const { currentUser,dispatch } = useAuth()
  const [loading,setLoading]=useState(false);
  async function LogIn() {
    setLoading(true);
    try {
      setDisplayErr('')
      const res = await signInWithEmailAndPassword(auth, emailRef.current.value, passwrdRef.current.value);
      const user = res.user;
      console.log(user.uid)
      dispatch({ type: "LOGIN", payload: { uid: user.uid } });
      navigate('/home');
    } catch (error) {
      console.error("Login failed:", error);
      setDisplayErr('Invalid Email or Password')
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <>
    <div className='flex justify-center items-center p-24 font-raleway'>
      <div className="px-4 py-6 space-y-6 md:px-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your information to log into your account</p>
        </div>
        
        <div className="space-y-4">
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
          <div className='flex justify-center'>
            <button
              className="border border-gray-600 rounded-lg px-2 py-1 text-white bg-black font-semibold shadow-lg hover:shadow-none"
              onClick={()=>{LogIn()}}
              disabled={loading}
            >
              Log In
            </button>
          </div>
          <div className='text-red-900 flex items-center justify-center'>
            {displayErr}
          </div>
          <div className='flex items-center justify-center'>
            Need an account? <Link to='/signup' className='px-2 text-blue-600 underline hover:opacity-80'>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}


