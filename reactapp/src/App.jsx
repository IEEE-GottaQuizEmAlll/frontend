import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/signup'
import Dashboard from './pages/dashboard'
import NewQuiz from './pages/newquiz'
import Pokedex from './pages/pokedex'
import Home from './pages/home'
import UserPage from './pages/UserPage'
import PlayQuiz from './pages/PlayQuiz'
import Navbar from './pages/navbar'
import { AuthProvider } from './context/AuthContext'


function App() {

  return (
    <>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        
            <Route path='/' element={<Navbar/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/Dashboard' element={<Dashboard/>}/>
            <Route path='/NewQuiz' element={<NewQuiz/>}/>
            <Route path='/Pokedex' element={<Pokedex/>}/>
            <Route path='/Home' element={<Home/>}/>
            <Route path='/Play' element={<PlayQuiz/>}/>
            <Route path='/User' element={<UserPage/>}/>
        
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    
    </>
  )
}

export default App
