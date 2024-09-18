import { useState, useEffect } from "react";

const QuizApp = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  // const [quizFinished, setQuizFinished] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("yokai_quiz.json");
        const data = await response.json();
        console.log("Parsed JSON data:", data); // デバッグ用
        setQuizzes(data.sort(() => 0.5 - Math.random())); // データをシャッフル
      } catch (error) {
        console.error("Error fetching JSON:", error);
      }
    };
    fetchQuizzes();
  }, []);

  const handleClick = (choice: string) => {
    const isCorrect = choice === quizzes[currentQuizIndex].answer;
    alert(
      isCorrect
        ? "正解！"
        : `残念！正解は「${quizzes[currentQuizIndex].answer}」です。`
    );
    setCorrect((prev) => (isCorrect ? prev + 1 : prev));

    const nextQuizIndex = currentQuizIndex + 1;
    if (nextQuizIndex >= quizzes.length) {
      // setQuizFinished(true); // この行を削除
      alert(`全${quizzes.length}問終了！正解数は${correct}問です。`);
      setCurrentQuizIndex(0);
      setCorrect(0);
    } else {
      setCurrentQuizIndex(nextQuizIndex);
    }
  };

  if (quizzes.length === 0) {
    return <div>クイズを読み込み中...</div>;
  }

  const currentQuiz = quizzes[currentQuizIndex];
  const shuffledChoices = currentQuiz.choices.sort(() => 0.5 - Math.random());

  return (
    <>
      <header className="title">
        <h1>妖怪 都道府県クイズ</h1>
      </header>
      <div className="quiz-container">
        <p className="quiz-question">{currentQuiz.question}</p>
        {shuffledChoices.map((choice: string, idx: number) => (
          <button
            className="quiz-choice"
            key={idx}
            onClick={() => handleClick(choice)}
          >
            {choice}
          </button>
        ))}
        <p className="quiz-score">{`${correct}/${currentQuizIndex}問正解中`}</p>
      </div>
      <footer>
        <p>出典: 文春新書 水木しげるロード全妖怪図鑑 </p>
      </footer>
    </>
  );
};

export default QuizApp;
