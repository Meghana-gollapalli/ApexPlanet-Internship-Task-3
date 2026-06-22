document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        {
            question: "Which CSS layout engine allows columns to adapt dynamically across mobile and desktops without specific widths?",
            answers: [
                { text: "CSS Grid & Flexbox", correct: true },
                { text: "Absolute Float Positioning", correct: false },
                { text: "HTML Table Elements", correct: false },
                { text: "Inline Block Stacking", correct: false }
            ]
        },
        {
            question: "What JavaScript API method alternative natively handles HTTP network requests asynchronously via promises?",
            answers: [
                { text: "JSON.parse()", correct: false },
                { text: "fetch()", correct: true },
                { text: "XMLHttpResource()", correct: false },
                { text: "document.write()", correct: false }
            ]
        },
        {
            question: "What must be defined in CSS to monitor and update layouts based on specific viewports?",
            answers: [
                { text: "@import rules", correct: false },
                { text: "Root variables", correct: false },
                { text: "@media Queries", correct: true },
                { text: "Pseudo-class states", correct: false }
            ]
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const questionNumberEl = document.getElementById('question-number');
    const questionTextEl = document.getElementById('question-text');
    const answerButtonsEl = document.getElementById('answer-buttons');
    const nextBtn = document.getElementById('next-btn');
    const quizContainerEl = document.getElementById('quiz-container');
    const resultContainerEl = document.getElementById('result-container');
    const scoreTextEl = document.getElementById('score-text');
    const restartBtn = document.getElementById('restart-btn');

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        resultContainerEl.classList.add('hide');
        quizContainerEl.classList.remove('hide');
        showQuestion();
    }

    function showQuestion() {
        resetQuizState();
        let currentQuestion = quizData[currentQuestionIndex];
        questionNumberEl.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
        questionTextEl.textContent = currentQuestion.question;

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('btn-choice');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsEl.appendChild(button);
        });
    }

    function resetQuizState() {
        nextBtn.classList.add('hide');
        while (answerButtonsEl.firstChild) {
            answerButtonsEl.removeChild(answerButtonsEl.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        
        if (isCorrect) {
            selectedBtn.classList.add('correct');
            score++;
        } else {
            selectedBtn.classList.add('wrong');
        }
        Array.from(answerButtonsEl.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add('correct');
            }
            button.disabled = true;
        });

        if (quizData.length > currentQuestionIndex + 1) {
            nextBtn.classList.remove('hide');
        } else {
            setTimeout(showScore, 1200);
        }
    }

    function showScore() {
        quizContainerEl.classList.add('hide');
        resultContainerEl.classList.remove('hide');
        scoreTextEl.textContent = `You scored ${score} out of ${quizData.length}!`;
    }

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        showQuestion();
    });

    restartBtn.addEventListener('click', startQuiz);

    const fetchBtn = document.getElementById('fetch-api-btn');
    const jokeSetupEl = document.getElementById('joke-setup');
    const jokeDeliveryEl = document.getElementById('joke-delivery');
    const spinner = document.getElementById('spinner');

    async function fetchJokeFromAPI() {
        const apiURL = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart';
        
        try {
            fetchBtn.disabled = true;
            spinner.classList.remove('hide');
            jokeSetupEl.textContent = "Connecting to external API streaming source...";
            jokeDeliveryEl.textContent = "";
            const response = await fetch(apiURL);
            
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }

            const data = await response.json();
            jokeSetupEl.innerHTML = `<strong>Setup:</strong> ${data.setup}`;
            jokeDeliveryEl.innerHTML = `<strong>Punchline:</strong> ${data.delivery}`;

        } catch (error) {
            console.error('API Fetch operational exception:', error);
            jokeSetupEl.textContent = "Failed to fetch content from the public API service connection.";
            jokeDeliveryEl.textContent = "Please check internet connection or retry later.";
        } finally {
            fetchBtn.disabled = false;
            spinner.classList.add('hide');
        }
    }

    fetchBtn.addEventListener('click', fetchJokeFromAPI);

    startQuiz();
});