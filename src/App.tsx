import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const QuizApp = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  useEffect(() => {
    Papa.parse(
      "https://drive.google.com/uc?export=download&id=1G2H-FRgLXWpEtomFziCGkI4h_-9uCtS6",
      {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Parsed CSV data:", results.data); // デバッグ用
          const quizData = results.data.map((quiz: any) => ({
            question: quiz.question,
            choices: [quiz.choice1, quiz.choice2, quiz.choice3, quiz.choice4],
            answer: quiz.answer,
          }));
          setQuizzes(quizData.sort(() => 0.5 - Math.random())); // quizData をシャッフル
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      }
    );
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const userAnswer = e.currentTarget.textContent;
    if (userAnswer === quizzes[currentQuizIndex].answer) {
      alert("正解!");
      setCorrect((prev) => prev + 1);
    } else {
      alert("残念!");
    }

    const nextQuizIndex = currentQuizIndex + 1;
    if (nextQuizIndex >= quizzes.length) {
      setQuizFinished(true);
    } else {
      setCurrentQuizIndex(nextQuizIndex);
    }
  };

  useEffect(() => {
    if (quizFinished) {
      alert(`${quizzes.length}問中${correct}問正解だったよ！また挑戦してね！`);
      setCurrentQuizIndex(0);
      setCorrect(0);
      setQuizFinished(false);
    }
  }, [quizFinished, correct, quizzes]);

  if (quizzes.length === 0) {
    return <div>クイズを読み込み中...</div>;
  }

  const currentQuiz = quizzes[currentQuizIndex];
  const shuffledChoices = currentQuiz.choices.sort(() => 0.5 - Math.random()); // 選択肢をシャッフル

  return (
    <>
      <header className="title">
        <h1>妖怪 都道府県クイズ</h1>
      </header>
      <div className="quiz-container">
        <p className="quiz-question">{currentQuiz.question}</p>
        {shuffledChoices.map((choice: string, idx: number) => (
          <button className="quiz-choice" key={idx} onClick={handleClick}>
            {choice}
          </button>
        ))}
        <p className="quiz-score">{`${correct}/${currentQuizIndex}問正解中!`}</p>
      </div>
      <footer>
        <p>出典: 文春新書 水木しげるロード全妖怪図鑑 </p>
      </footer>
    </>
  );
};

export default QuizApp;
