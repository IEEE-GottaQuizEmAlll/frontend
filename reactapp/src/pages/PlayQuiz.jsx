import { React,useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase';
import { doc,updateDoc,collection,getDoc, getDocs } from "firebase/firestore";
import { useParams,useNavigate, Link } from 'react-router-dom';

export default function PlayQuiz() {
  const navigate = useNavigate()
  const {qid} = useParams() 
  const {currentUser} = useAuth();
  const [loading,setLoading] = useState(false)
  const [userData,setUserData] = useState({})
  const [quizData,setQuizData] = useState({})
  const [answers,setAnswers] = useState({})
  const [questions,setQuestions] = useState([])
  const [playedQuiz,setPlayedQuiz] = useState(false)
  const [initialTime,setInitialTime] = useState(new Date())
  async function UserInfo() {
    try {
      const ref = doc(db, "Users", currentUser);
      const docSnap = await getDoc(ref);
      const userDataFromSnapshot = docSnap.data();
      setUserData(userDataFromSnapshot);
  
      const quizRef = doc(db, "Quiz", qid);
      const docSnap1 = await getDoc(quizRef);
      setQuizData(docSnap1.data());
      
      const quesRef = collection(db, "Quiz", qid, "questions");
      const questionsSnapshot = await getDocs(quesRef);
      const newQuestion = [];
      let qno = 0;
      questionsSnapshot.forEach((doc) => {
        qno+=1;
        newQuestion.push({qno:qno, id: doc.id, data: doc.data() });
      });
      setQuestions(newQuestion);
      setInitialTime(new Date());
      if (userDataFromSnapshot.Quizes.includes(qid)) {
        setPlayedQuiz(true);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    setLoading(true)
    UserInfo()
    
  },[])

  const changeAnswer = (op,no) => {
    const newAnswers= {...answers}
    newAnswers[no] = op;
    setAnswers(newAnswers)
  }
  const changeAnswerForFill=(ans,no)=>{
    const newAnswers= {...answers}
    newAnswers[no] = ans;
    setAnswers(newAnswers)
  }
  if(loading){
    return <>
      Loading
    </>
  }
  async function SubmitQuiz(){
    setLoading(true)
    try {
      const finalTime = new Date();
      const differenceInMilli = finalTime.getTime() - initialTime.getTime();
      const newUserData = userData
      newUserData.Quizes = [...userData.Quizes,qid];
      const userDocRef = doc(db,'Users',currentUser)
      await updateDoc(userDocRef,newUserData);
      var correct = 0;
      questions.forEach(q=>{
        if(q.data.type==='mcq'){
          if(answers[q.qno] && q.data.answer-1===q.data.options.indexOf(answers[q.qno])){
            correct+=1;
          }
        }
        else{
          if(answers[q.qno] && q.data.answer===answers[q.qno]){
            correct+=1;
          }
        }
      })
      const newQuizData = quizData
      newQuizData.LeaderBoard = [...quizData.LeaderBoard,{uid:currentUser,name:userData.name,TimeTaken:differenceInMilli,CorrectAnswers:correct}];
      newQuizData.LeaderBoard.sort((a,b)=>{
        if(a.CorrectAnswers>b.CorrectAnswers){
          return -1;
        }
        if(a.CorrectAnswers<b.CorrectAnswers){
          return 1;
        }
        if(a.TimeTaken>b.TimeTaken){
          return 1;
        }
        if(a.TimeTaken<b.TimeTaken){
          return -1;
        }

        return 0;
      })
      newQuizData.LeaderBoard = newQuizData.LeaderBoard.slice(0,50);
      const quizDocRef = doc(db,'Quiz',qid)
      newQuizData.Popularity += 1;
      await updateDoc(quizDocRef,newQuizData)
      setPlayedQuiz(true)
      alert(`Succesfully Submitted You Got ${correct} Questions Right`);
      //navigate(`/Play/${qid}`)


    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
    
  }
  return (
    <>
     <div className='font-raleway p-10 bg-[#FF9441] min-h-[625px]'>
     <div className='flex flex-col justify-center items-center'>
      <h1 className='text-5xl py-5 font-black'>{quizData.name} <Link className='text-sm font-semibold'>By {quizData.CreatorName}</Link></h1>
      
      <h1 className='text-xl py-5 font-semibold'>{playedQuiz? 'You Have Already Played Quiz!':'Quiz Has Started All The Best!!'}</h1>
      <div className='flex flex-col gap-4 space-y-1'>
      { 
        !playedQuiz && questions.map((q)=>{
          return (
          <div className='flex flex-col p-4 border border-bold rounded-xl  space-y-2 bg-white border-2 border-black'>
            <h1 className='text-lg font-semibold'>Question {q.qno}</h1>
            <h1 className='text-2xl font-semibold'>{q.data.question}</h1>
            {q.data.type==='mcq'? 
            <div>
                {q.data.options.map(op=>{
                  return(
                    <div className='py-1 text-medium hover:border-b-2'>
                  <div className={op===answers[q.qno]? 'text-green-500':'cursor-pointer'} onClick={()=>{changeAnswer(op,q.qno)}}>
                    {'-> '}{op}
                  </div>
                  </div>)
                })}
            </div>
            :
            <div>
              <input 
                type = 'text'
                className='w-full focus:outline-none border-b-2'
                placeholder={`Type Answer Here`}
                onChange={(e)=>{changeAnswerForFill(e.target.value,q.qno)}}
              />
            </div>}
          </div>
          )
        })
        
        
      }
      </div>
      <div className={playedQuiz?"hidden":''}><button onClick={(e)=>{e.preventDefault;SubmitQuiz()}} className='py-1 px-2 mt-6 font-semibold border-2 border-black rounded-lg text-white bg-black shadow-lg hover:shadow-none hover:text-[#FF9441]'>Submit</button></div>
      <span className={!playedQuiz?"hidden":''}>
        <h1 className='text-3xl font-bold py-3 underline'>Leader Board</h1>
      </span>
      <table class="border-collapse w-1/2 my-5" className={!playedQuiz?'hidden':''}>
          <thead >
              <tr>
                  <th class="border border-black border-2 px-4 py-2 bg-white ">Name</th>
                  <th class="border border-black border-2 px-4 py-2 bg-white">Correct Answers</th>
                  <th class="border border-black border-2 px-4 py-2 bg-white">Time Taken</th>
              </tr>
          </thead>
          <tbody>
              {playedQuiz && quizData.LeaderBoard.map(l => {
                  return (
                      <tr class="py-5 border-b border-black border-2 bg-white">
                          <td class="border border-black border-2 px-4 py-2 text-center">{l.name}</td>
                          <td class="border border-black border-2 px-4 py-2 text-center">{l.CorrectAnswers}</td>
                          <td class="border border-black border-2 px-4 py-2 text-center">{l.TimeTaken}</td>
                      </tr>
                  )
              })}
          </tbody>
      </table>

      </div>
     </div>
     <div className="h-12 flex items-center justify-center bg-[#DE5239] font-raleway font-bold">Made by IEEE | GottaQuizEmAll</div>
    </>
  )
}


