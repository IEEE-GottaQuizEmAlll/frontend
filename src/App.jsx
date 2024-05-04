
import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [questions, setQuestions] = useState([
    {
      question: "",
      type: "mcq",
      options: ["", "", "", ""],
      answer: ""
    }
  ]);

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

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "mcq",
        options: ["", "", "", ""],
        answer: ""
      }
    ]);
  };

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Question"
            value={question.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
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
                <input
                  key={optionIndex}
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, optionIndex, e.target.value)
                  }
                />
              ))}
              <select
                value={question.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                <option value="">Select Answer</option>
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}
      <button onClick={handleAddQuestion}>Add Question</button>
    </div>
  );
}