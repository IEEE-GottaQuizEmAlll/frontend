import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, dispatch } = useAuth();

  async function SignOut() {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }   

  if(currentUser) {
    return (
      <header className="flex items-center justify-between h-16 px-4 md:px-5 bg-[#000100] font-bold text-white font-raleway">
        <div className="flex flex-row items-center gap-2 text-lg">
          <div className="w-12 h-12 bg-center hover:cursor-pointer hover:scale-90 transition ease-in-out"  onClick={() => navigate('/Home')} style={{backgroundImage: `url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png')`}}></div>
          <h1 className="text-xl">GottaCatchEmAll</h1>
        </div>

        <nav className="flex items-center gap-40">
        <button onClick={() => navigate('/Home')} className="p-2 rounded-xl text-sm hover:underline underline-offset-4 hover:opacity-70">
            Home
          </button>
          <button onClick={() => navigate('/pokedex')} className="p-2 rounded-xl text-sm hover:underline underline-offset-4 hover:opacity-70">
            Pokedex
          </button>
          <button onClick={() => navigate('/Play')} className="p-2 rounded-xl text-sm hover:underline underline-offset-4 hover:opacity-70">
            Play Quiz
          </button>
          <button onClick={() => navigate('/NewQuiz')} className="p-2 rounded-xl text-sm hover:underline underline-offset-4 hover:opacity-70">
            Create Quiz
          </button>
          <button onClick={SignOut} className="p-2 mr-6 rounded-xl text-sm hover:underline underline-offset-4 hover:opacity-70">
            Sign out
          </button>
        </nav>
      </header>
    );
  } else {
    return (
      <header className="flex items-center justify-between h-16 px-4 md:px-5 bg-[#000100] font-bold text-white font-raleway">
        <div className="flex flex-row items-center gap-2 text-lg">
          <div className="w-12 h-12 bg-center hover:cursor-pointer hover:scale-90"  onClick={() => navigate('/')} style={{backgroundImage: `url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png')`}}></div>
          <h1 className="text-xl">GottaCatchEmAll</h1>
        </div>

        <nav className="flex items-center gap-60">
          <button onClick={() => navigate('/login')} className="p-2 mr-6 rounded-xl text-sm hover:underline underline-offset-4 hover:opacity-70">
            Log In / Sign Up
          </button>
        </nav>
      </header>
    );
  }
}
