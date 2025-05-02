<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Educational Math Quiz Game</title>
<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f0f8ff;
    color: #333;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 480px;
    margin: 2rem auto;
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    text-align: center;
  }
  h1 {
    margin-bottom: 0.5rem;
    color: #0077cc;
  }
  #start-btn, #next-btn, #restart-btn {
    background: #0077cc;
    color: white;
    border: none;
    padding: 0.7rem 1.4rem;
    font-size: 1.1rem;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
  }
  #start-btn:hover, #next-btn:hover, #restart-btn:hover {
    background: #005fa3;
  }
  #question-container {
    display: none;
    margin-top: 1rem;
  }
  #question {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  .btn-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  button.answer-btn {
    background: #e0eefe;
    border: 2px solid transparent;
    padding: 0.8rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;
  }
  button.answer-btn:hover {
    background: #c1dbfd;
  }
  button.answer-btn.correct {
    background-color: #4caf50;
    color: white;
    border-color: #388e3c;
  }
  button.answer-btn.wrong {
    background-color: #f44336;
    color: white;
    border-color: #d32f2f;
  }
  #score-container {
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
  #final-score {
    font-size: 1.4rem;
    margin-top: 1rem;
    color: #0077cc;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>Educational Math Quiz Game</h1>
    <div id="start-container">
      <p>Test your math skills with this fun quiz! You will be asked 10 questions.</p>
      <button id="start-btn">Start Quiz</button>
    </div>
    <div id="question-container">
      <div id="question">Question text</div>
      <div class="btn-grid" id="answer-buttons">
        <!-- Answer buttons will be inserted here -->
      </div>
      <button id="next-btn" style="display:none;">Next Question</button>
      <div id="score-container">Score: 0 / 0</div>
      <div id="final-score" style="display:none;"></div>
      <button id="restart-btn" style="display:none;">Restart Quiz</button>
    </div>
  </div>

<script>
  const startButton = document.getElementById('start-btn');
  const nextButton = document.getElementById('next-btn');
  const restartButton = document.getElementById('restart-btn');
  const questionContainer = document.getElementById('question-container');
  const startContainer = document.getElementById('start-container');
  const questionElement = document.getElementById('question');
  const answerButtonsElement = document.getElementById('answer-buttons');
  const scoreContainer = document.getElementById('score-container');
  const finalScoreElement = document.getElementById('final-score');

  let currentQuestionIndex = 0;
  let score = 0;
  let totalQuestions = 10;
  let questions = [];

  function generateQuestion() {
    // Randomly generate a simple math question (add, subtract or multiply)
    const operations = ['+', '-', '*'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b;

    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        break;
      case '-':
        a = Math.floor(Math.random() * 20) + 10; // ensure a > b for positive results mostly
        b = Math.floor(Math.random() * 10) + 1;
        break;
      case '*':
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        break;
    }

    let correctAnswer;
    if (op === '+') correctAnswer = a + b;
    else if (op === '-') correctAnswer = a - b;
    else correctAnswer = a * b;

    // Generate 3 wrong answers near correct answer
    const answers = new Set();
    answers.add(correctAnswer);

    while (answers.size < 4) {
      let wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
      if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
        answers.add(wrongAnswer);
      }
    }

    // Shuffle answers
    const shuffledAnswers = Array.from(answers).sort(() => Math.random() - 0.5);

    return {
      question: `What is ${a} ${op} ${b}?`,
      correctAnswer: correctAnswer,
      answers: shuffledAnswers
    };
  }

  function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
    scoreContainer.innerText = `Score: ${score} / ${currentQuestionIndex}`;
  }

  function showQuestion(questionObj) {
    questionElement.innerText = questionObj.question;
    questionObj.answers.forEach(answer => {
      const button = document.createElement('button');
      button.innerText = answer;
      button.classList.add('answer-btn');
      if (answer === questionObj.correctAnswer) {
        button.dataset.correct = true;
      }
      button.addEventListener('click', selectAnswer);
      answerButtonsElement.appendChild(button);
    });
  }

  function resetState() {
    clearStatusClass(document.body);
    nextButton.style.display = 'none';
    finalScoreElement.style.display = 'none';
    restartButton.style.display = 'none';
    while (answerButtonsElement.firstChild) {
      answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
  }

  function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) {
      score++;
    }
    setStatusClass(selectedButton, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
      setStatusClass(button, button.dataset.correct === "true");
      button.disabled = true;
    });
    currentQuestionIndex++;
    scoreContainer.innerText = `Score: ${score} / ${currentQuestionIndex}`;
    if (currentQuestionIndex < totalQuestions) {
      nextButton.style.display = 'inline-block';
    } else {
      // End of quiz
      showFinalScore();
    }
  }

  function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
      element.classList.add('correct');
    } else {
      element.classList.add('wrong');
    }
  }

  function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
  }

  function showFinalScore() {
    finalScoreElement.style.display = 'block';
    questionElement.innerText = 'Quiz finished!';
    finalScoreElement.innerText = `Your total score is ${score} out of ${totalQuestions}.`;
    nextButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
  }

  function startGame() {
    startContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    score = 0;
    currentQuestionIndex = 0;
    questions = [];
    for (let i = 0; i < totalQuestions; i++) {
      questions.push(generateQuestion());
    }
    setNextQuestion();
  }

  startButton.addEventListener('click', startGame);
  nextButton.addEventListener('click', () => {
    setNextQuestion();
  });
  restartButton.addEventListener('click', () => {
    startContainer.style.display = 'block';
    questionContainer.style.display = 'none';
  });
</script>
</body>
</html>


kode permainan edukasi


KOTAK HITAM
Bahasa Indonesia:

Situs web
Bahasa Indonesia:

VIDEONYA

Pengguna meminta kode "permainan edukasi", tetapi permintaannya sangat luas dan tidak spesifik. Saya harus mengklarifikasi beberapa detail agar permainan edukasi tersebut bermakna dan tepat sasaran.

Saya harus bertanya kepada pengguna tentang: