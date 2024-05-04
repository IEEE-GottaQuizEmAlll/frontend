import React,{useContext, useReducer, useState} from "react";
import { useEffect,createContext } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
};


export function useAuth(){
    return useContext(AuthContext)
}
const AuthContext=createContext(INITIAL_STATE)
export function AuthProvider({children}){
    const [state,dispatch] = useReducer(AuthReducer,INITIAL_STATE)
    const [Notloading,setNotLoading] = useState(true)
    useEffect(()=>{
        setNotLoading(false)
        localStorage.setItem("user",JSON.stringify(state.currentUser))
        setNotLoading(true)
    },[state.currentUser])
    return(
        <AuthContext.Provider value={{ currentUser:state.currentUser , dispatch}}>
            {Notloading && children}
        </AuthContext.Provider>
    )
}