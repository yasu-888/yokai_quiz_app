import React, { useState, useEffect } from "react";
const QuizApp = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch("yokai_quiz.json");
                const data = await response.json();
                console.log("Parsed JSON data:", data); // デバッグ用
                setQuizzes(data.sort(() => 0.5 - Math.random())); // データをシャッフル
            }
            catch (error) {
                console.error("Error fetching JSON:", error);
            }
        };
        fetchQuizzes();
    }, []);
    const handleClick = (choice) => {
        const isCorrect = choice === quizzes[currentQuizIndex].answer;
        alert(isCorrect
            ? "正解！"
            : `残念！正解は「${quizzes[currentQuizIndex].answer}」です。`);
        setCorrect((prev) => (isCorrect ? prev + 1 : prev));
        const nextQuizIndex = currentQuizIndex + 1;
        if (nextQuizIndex >= quizzes.length) {
            setQuizFinished(true);
        }
        else {
            setCurrentQuizIndex(nextQuizIndex);
        }
    };
    if (quizzes.length === 0) {
        return React.createElement("div", null, "\u30AF\u30A4\u30BA\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D...");
    }
    const currentQuiz = quizzes[currentQuizIndex];
    const shuffledChoices = currentQuiz.choices.sort(() => 0.5 - Math.random());
    return (React.createElement(React.Fragment, null,
        React.createElement("header", { className: "title" },
            React.createElement("h1", null, "\u5996\u602A \u90FD\u9053\u5E9C\u770C\u30AF\u30A4\u30BA")),
        React.createElement("div", { className: "quiz-container" },
            React.createElement("p", { className: "quiz-question" }, currentQuiz.question),
            shuffledChoices.map((choice, idx) => (React.createElement("button", { className: "quiz-choice", key: idx, onClick: () => handleClick(choice) }, choice))),
            React.createElement("p", { className: "quiz-score" }, `${correct}/${currentQuizIndex}問正解中`)),
        React.createElement("footer", null,
            React.createElement("p", null, "\u51FA\u5178: \u6587\u6625\u65B0\u66F8 \u6C34\u6728\u3057\u3052\u308B\u30ED\u30FC\u30C9\u5168\u5996\u602A\u56F3\u9451 "))));
};
export default QuizApp;
