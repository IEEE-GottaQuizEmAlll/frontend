import { React } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
//<!--
// v0 by Vercel.
// https://v0.dev/t/uvW2JgiWahF
//-->

export default function Navbar() {
  const navigate = useNavigate()
  const {currentUser,dispatch} = useAuth()
  async function SignOut(){
    try {
      await signOut(auth)
      dispatch({type: "LOGOUT"})
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
    
  } 
  return (
    <>
      

      <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b">
      <div className="flex items-center gap-2 text-lg font-semibold" >
        <svg width="30" height="100" className='py-8'>
          <image href="https://wallpapers.com/images/hd/charmander-pixel-art-5uw31akfympfitcn.png" width="30" height="30"/>
        </svg>
        <h1>GottaCatchEmAlll</h1>
      </div>

        <nav className="flex items-center gap-4">
        <div className="text-sm font-medium hover:underline underline-offset-4">
            <Link to='/home'>Home</Link>
          </div>
          
          <button onClick={()=>{SignOut()}} className="text-sm font-medium hover:underline underline-offset-4">
            <span>Sign out</span>
          </button>
        </nav>
      </header>
    </>
  )
}

 
