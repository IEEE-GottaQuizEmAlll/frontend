import { React,useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase';
import { doc,updateDoc,collection,getDoc, getDocs } from "firebase/firestore";
import { useParams,useNavigate } from 'react-router-dom';

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
      <h1>{quizData.name}</h1>
      <h1>By {quizData.CreatorName}</h1>
      <h1>{playedQuiz? 'You Have Already Played Quiz':'Quiz Has Started All The Best'}</h1>
      { 
        !playedQuiz && questions.map((q)=>{
          return (<>
            <h1>Question {q.qno}</h1>
            <h1>{q.data.question}</h1>
            {q.data.type==='mcq'? 
            <div>
                {q.data.options.map(op=>{
                  return(<div className={op===answers[q.qno]? 'text-green-500':'cursor-pointer'} onClick={()=>{changeAnswer(op,q.qno)}}>
                    {op}
                  </div>)
                })}
            </div>
            :
            <div>
              <input 
                type = 'text'
                className='w-1/2'
                placeholder={`Type Answer Here for Question ${q.qno}`}
                onChange={(e)=>{changeAnswerForFill(e.target.value,q.qno)}}
              />
            </div>}
            </>
          )
        })
        
        
      }
      <div className={playedQuiz?"hidden":''}><button onClick={(e)=>{e.preventDefault;SubmitQuiz()}}>Submit</button></div>
      <h1 className={!playedQuiz?"hidden":''}>Leader Board</h1>
      {
        playedQuiz && quizData.LeaderBoard.map(l=>{
            return(
              <div>
                <h1>{l.name}</h1>
                <h1>{l.CorrectAnswers}</h1>
                <h1>{l.TimeTaken}</h1>
              </div>
            )
        })
      }
    </>
  )
}


