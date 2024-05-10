import { React,useState,useEffect,useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase';
import {collection,query,orderBy,limit,getDocs,where} from 'firebase/firestore'
import QuizCard from './QuizCardFroHome';

export default function Home() {
  const [quizType,setQuizType] = useState(0);
  const searchRef = useRef()
  const [results,setResults] = useState([])
  const [loading,setLoading] = useState(false)
  const {currentUser} = useAuth()

  useEffect(()=>{
    setLoading(true)
    if(quizType===1){
      async function RecentQuizes(){
        try {
          const ref = collection(db,"Quiz");
          const q = query(ref,orderBy("date","desc"),limit(10));
          const res = await getDocs(q);
          const searchData = []
          res.forEach((doc) => (
          searchData.push({
            id: doc.id,
            data: doc.data()
          })
        ));
          setResults(searchData);
        } catch (error) {
          console.log(error)
        }
        finally{
          setLoading(false)
        }
      }
      RecentQuizes();
    }
    else if(quizType===0){
      async function PopularQuizes(){
        try {
          const ref = collection(db,"Quiz");
          const q = query(ref,orderBy("Popularity","desc"),limit(10));
          const res = await getDocs(q);
          const searchData = []
          res.forEach((doc) => (
          searchData.push({
            id: doc.id,
            data: doc.data()
          })
        ));
          setResults(searchData);
        } catch (error) {
          console.log(error)
        }
        finally{
          setLoading(false)
        }
      }
      PopularQuizes();
    }
    else{
      setLoading(false)
    }
  },[quizType])
  async function ResultQuizes(e){
    e.preventDefault()
    console.log(searchRef.current.value)
    setLoading(true)
    try {
      const ref = collection(db,"Quiz");
      const q = query(ref,where('name','>=',searchRef.current.value),where('name','<=',searchRef.current.value+'\uf8ff'),limit(10));
      const res = await getDocs(q);
      const searchData = []
          res.forEach((doc) => (
          searchData.push({
            id: doc.id,
            data: doc.data()
          })
        ));
      setResults(searchData);
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <>
      <div className=' min-h-[640px] bg-[#FF9441]'>
      <div className="flex flex-wrap justify-center items-center h-12 py-5 text-lg font-semibold">
          <div className='flex space-x-3'>
            <div className={quizType===0? 'bg-black text-white rounded-lg': ""}>
            <button className='px-2 ' onClick={()=>{setQuizType(0)}}>
              Popular
            </button>
            </div>
            <div className={quizType===1? 'bg-black text-white rounded-lg': ""}>
            <button className='px-2' onClick={()=>{setQuizType(1)}}>
              Recent            
            </button>
            </div>
            <div className={quizType===2? 'bg-black text-white rounded-lg': ""}>
            <button className='px-2' onClick={()=>{setQuizType(2)}}>
              Search
            </button>
            </div>
          </div>
        </div>
        
        <div className='mx-10 text-lg flex flex-col space-y-3'>
      <div className={quizType==2? 'visible flex':'hidden'}>
      <input
          className=" mt-4 flex h-10 w-full md:w-96 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Should be at least 5 characters"
          ref={searchRef}
        />
        <button type='button' className='mt-4 mx-3 px-5 border border-gray-600 rounded-lg bg-black text-white font-semibold p-1' onClick={(e)=>ResultQuizes(e)}>Search</button>
        </div>
        <h1 className='text-xl font-bold underline'>Results by {quizType===0? "Popularity":quizType===1?"Recent":"Search"}</h1>
        <div className='flex flex-wrap gap-8 '>
        { !loading &&
          results.map(doc=>{
            console.log(doc)
            return(
              <QuizCard doc={doc}/>
            )
          })
        }
        </div>
        </div>
      </div>
      <div className="h-12 flex items-center justify-center bg-[#DE5239] font-raleway font-bold">Made by IEEE | GottaQuizEmAll</div>
    </>
  )
}


