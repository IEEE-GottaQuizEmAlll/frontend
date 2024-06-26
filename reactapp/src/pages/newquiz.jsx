import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, addDoc, collection, setDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "../firebase";

const NewQuiz = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const uid = currentUser;
  // State for the questions
  const [questions, setQuestions] = useState([
    {
      question: "",
      type: "mcq",
      options: ["", "", "", ""],
      answer: "",
      search: "",
    },
  ]);

  // Function to add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "mcq",
        options: ["", "", "", ""],
        answer: "",
        search: "",
      },
    ]);
  };

  // Function to handle question change
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  // Function to handle question type change
  const handleTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = value;
    setQuestions(updatedQuestions);
  };

  // Function to handle option change
  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Function to handle answer change
  const handleAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = value;
    setQuestions(updatedQuestions);
  };

  // Function to handle search change
  const handleSearchChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].search = value;
    setQuestions(updatedQuestions);
  };

  // Function to create a new quiz
  const createNewQuiz = () => {
    setQuestions([
      {
        question: "",
        type: "mcq",
        options: ["", "", "", ""],
        answer: "",
        search: "",
      },
    ]);
  };

  // State for the quiz name
  const [quizName, setQuizName] = useState("");

  // Function to handle the submission of the quiz
  const submitQuiz = async () => {
    // Check if the quiz name is valid
    if (quizName.length <= 5) {
      alert("Quiz name should be more than 5 characters");
      return;
    }

    // Check if a quiz with this name already exists
    const quizRef = doc(db, "Quiz", quizName);
    const quizSnap = await getDoc(quizRef);
    const userRef = doc(db,'Users',currentUser)
    const userSnap = await getDoc(userRef)
    const userData = userSnap.data()
    if (quizSnap.exists()) {
      alert("A quiz with this name already exists");
      return;
    }
    console.log(userData)
    // Create the quiz data
    const quizData = {
      CreatorName: userData.name,
      LeaderBoard: [],
      Popularity: 0,
      Rating: 0,
      date: serverTimestamp(),
      name: quizName,
    };

    // Add the quiz to Firestore
    await setDoc(quizRef, quizData);

    // Add each question to Firestore
    for (let question of questions) {
      const questionRef = collection(db, "Quiz", quizName, "questions");
      await addDoc(questionRef, question);
    }

    alert("Quiz created successfully");
    navigate('/home')
  };

  return (
    
    <>
      <div className="flex justify-center items-center p-8 bg-[#FF9441]">
      <div className=" bg-[#FFFFFF] p-16 flex flex-col gap-4 justify-center items-center font-raleway border-2 border-black w-[500px] rounded-2xl">
      <div className="text-4xl mb-8 font-extrabold">Create The Quiz</div>
      <input
        className="input border-b-2 focus:outline-none"
        type="text"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        placeholder="Quiz Name"
      />
      {questions.map((question, index) => (
        <div key={index} className="flex flex-col gap-4">
          <h3>Question {index + 1}?</h3>
          <input
            className="input border-b-2"
            type="text"
            value={question.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder="Enter question"
          />
          <select
            className="select border-2 rounded-lg"
            value={question.type}
            onChange={(e) => handleTypeChange(index, e.target.value)}
          >
            <option className="option" value="mcq">
              MCQ
            </option>
            <option className="option" value="fill">
              Fill in the Blanks
            </option>
          </select>
          {question.type === "mcq" && (
            <div>
              {question.options.map((_, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    className="input"
                    type="text"
                    value={question.options[optionIndex]}
                    onChange={(e) =>
                      handleOptionChange(index, optionIndex, e.target.value)
                    }
                    placeholder={`Enter option ${optionIndex + 1}`}
                  />
                </div>
              ))}
              <select
                className="select mt-4 border-b-2"
                value={question.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                <option className="option" value="">
                  Select Answer
                </option>
                {question.options.map((_, optionIndex) => (
                  <option key={optionIndex} value={optionIndex + 1}>
                    Option {optionIndex + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
          {question.type === "fill" && (
            <div>
              <input
                className="input"
                type="text"
                value={question.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Enter answer"
              />
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-4 mt-4">
      <button className="button text-sm border-2 px-2 py-1 rounded-lg shadow-sm hover:shadow-none hover:opacity-80" onClick={addQuestion}>
        Add Question
      </button>
      <button className="button text-sm border-2 px-2 py-1 rounded-lg shadow-sm hover:shadow-none hover:opacity-80" onClick={createNewQuiz}>
        Reset Quiz
      </button>
      <button className="button text-sm border-2 px-2 py-1 rounded-lg shadow-sm hover:shadow-none hover:opacity-80" onClick={submitQuiz}>
        Submit Quiz
      </button>
      </div>
    </div>
    
    </div>
    <div className="h-12 flex items-center justify-center bg-[#DE5239] font-raleway font-bold">Made by IEEE | GottaQuizEmAll</div>
    </>
    
  );
};
export default NewQuiz;
