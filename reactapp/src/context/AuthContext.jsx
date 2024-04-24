import React,{useContext, useState} from "react";
import { auth } from "../firebase";
import { useEffect } from "react";

export function useAuth(){
    return useContext(AuthContext)
}
const AuthContext=React.createContext()
export function AuthProvider({children}){
    const [user,setUser] = useState()
    function signup(email,password){
        return auth.createUserWithEmailAndPassword(email,password)
    }

    useEffect(()=>{
        const unsub = auth.onAuthStateChanged(user1=>{
            setUser(user1)
        })
        return unsub
    },[])
    const value = {user,signup}
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}