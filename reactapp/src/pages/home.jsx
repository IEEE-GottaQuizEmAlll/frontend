import { React } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const {currentUser} = useAuth()
  return (
    <>
      {currentUser && JSON.stringify(currentUser)}
    </>
  )
}


