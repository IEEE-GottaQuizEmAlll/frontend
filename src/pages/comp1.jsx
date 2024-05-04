import React, { useState } from "react";
import "./Comp1.css";
const Comp1 = () => {
  const [questions, setQuestions] = useState([
    {
      question: "",
      type: "mcq",
      options: ["", "", "", ""],
      answer: "",
      search: "",
    },
  ]);

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

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = value;
    setQuestions(updatedQuestions);
  };

  const handleSearchChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].search = value;
    setQuestions(updatedQuestions);
  };

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

  return (
    <div>
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
                placeholder="Correct answer"
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
      <button>Submit Quiz</button>
    </div>
  );
};

export default Comp1;
