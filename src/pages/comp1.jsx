import React, { useState, useEffect } from "react";
import "./Comp1.css";
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, addDoc, collection, setDoc, serverTimestamp } from "firebase/firestore"; 
import { db } from "./firebase";

const Comp1 = () => {
  const { currentUser, dispatch } = useAuth();

  const uid = currentUser.uid;

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

  // State for the user data
  const [userData, setUserData] = useState(null);

  // Effect hook to fetch the user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", currentUser.uid); // replace "users" with your collection name
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

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

    if (quizSnap.exists()) {
      alert("A quiz with this name already exists");
      return;
    }

    // Create the quiz data
    const quizData = {
      CreatorName: userData.username,
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
  };

  return (
    <div>
      <input
        type="text"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        placeholder="Quiz Name"
      />
      {questions.map((question, index) => (
        <div key={index}>
          <h3>Question {index + 1}</h3>
          <input
            type="text"
            value={question.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder="Enter question"
          />
          <select
            value={question.type}
            onChange={(e) => handleTypeChange(index, e.target.value)}
          >
            <option value="mcq">MCQ</option>
            <option value="fill">Fill in the Blanks</option>
          </select>
          {question.type === "mcq" && (
            <div>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, optionIndex, e.target.value)
                    }
                    placeholder={`Enter option ${optionIndex + 1}`}
                  />
                </div>
              ))}
              <input
                type="text"
                value={question.search}
                onChange={(e) => handleSearchChange(index, e.target.value)}
                placeholder="Enter search term"
              />
              <select
                value={question.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                <option value="">Select Answer</option>
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={optionIndex + 1}>
                    Option {optionIndex + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={createNewQuiz}>Create New Quiz</button>
      <button onClick={submitQuiz}>Submit Quiz</button>
    </div>
  );
};

export default Comp1;
