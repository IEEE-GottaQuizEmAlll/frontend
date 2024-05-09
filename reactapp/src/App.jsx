import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
import Comp1 from './pages/newquiz'
import Pokedex from './pages/pokedex'
import Home from './pages/home'
import UserPage from './pages/UserPage'
import PlayQuiz from './pages/PlayQuiz'
import Navbar from './pages/navbar'
import { AuthProvider, useAuth} from './context/AuthContext'
import { Navigate } from "react-router-dom";
import LandingPage from './pages/LandingPage'
import Footer from './pages/footer'


function App() {
  
  function Proctect({children}){
    const  currentUser= useAuth()
    return currentUser.currentUser? children:<Navigate to="/login"/>
  }
  function UnProctect({children}){
    const  currentUser= useAuth()
    return currentUser.currentUser? <Navigate to="/home"/>:children
  }
  return (
    <>
    <AuthProvider>
    <BrowserRouter>
      <Navbar/>
      <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/login' element={<UnProctect><Login/></UnProctect>}/>
            <Route path='/signup' element={<UnProctect><Signup/></UnProctect>}/>
            <Route path='/Dashboard' element={<Proctect><Dashboard/></Proctect>}/>
            <Route path='/newQuiz' element={<Proctect><Comp1/></Proctect>}/>
            <Route path='/Pokedex' element={<Proctect><Pokedex/></Proctect>}/>
            <Route path='/Home' element={<Proctect><Home/></Proctect>}/>
            <Route path='/Play/:qid' element={<Proctect><PlayQuiz/></Proctect>}/>
            <Route path='/User' element={<Proctect><UserPage/></Proctect>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
    </AuthProvider>
    
    </>
  )
}

export default App
