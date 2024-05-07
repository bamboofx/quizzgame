
let questionsData;
function shuffleArray(array) {
    let currentIndex = array.length;
    while (0 !== currentIndex) {
        let randomIndex = Math.floor(Math.random() * --currentIndex);
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Hàm xáo trộn mảng câu trả lời và giữ vị trí câu trả lời chính xác
function shuffleAnswers(data) {
    for (let question of data) {
        let answers = question.answers;
        let correctAnswerIndex = Number(question.correctAnswer);

        // Tạo bản sao của mảng câu trả lời ban đầu
        const originalAnswers = answers.slice();

        // Xáo trộn mảng câu trả lời
        shuffleArray(answers);

        // Thêm A B C D vào câu trả lời

        // Tìm vị trí mới của câu trả lời chính xác trong mảng đã xáo trộn
        const newCorrectAnswerIndex = answers.indexOf(originalAnswers[correctAnswerIndex]);

        // Đảm bảo câu trả lời chính xác luôn ở vị trí mới tương ứng
        question.correctAnswer = newCorrectAnswerIndex;
        for (let i = 0; i < answers.length; i++) {
            // Loại bỏ 3 ký tự đầu tiên trong mỗi câu trả lời
            answers[i] = answers[i].slice(3);
            answers[i] = String.fromCharCode(65 + i) + '. ' + answers[i];
        }
  
    }
    return data;
}
fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data = shuffleAnswers(shuffleArray(data));
        console.log(data);
        questionsData = data;
        loadQuestion();
    }
    );

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const answerElements = document.querySelectorAll('.answer');
const scoreElement = document.getElementById('score');

function loadQuestion() {
    const question = questionsData[currentQuestionIndex];
    // Thêm số thứ tự câu hỏi vào tiêu đề câu hỏi Câu index: 1, loại bỏ 7 ký tự đầu tiên
    question.question=question.question.slice(7);
    questionElement.textContent = `Câu hỏi ${currentQuestionIndex + 1}: ${question.question}`;
    //questionElement.textContent = question.question;

    answerElements.forEach((answerElement, index) => {
        answerElement.textContent = question.answers[index];
        answerElement.onclick = () => checkAnswer(index);
    });
}

function checkAnswer(selectedAnswerIndex) {
    // Không cho phép chọn lại câu trả lời
    answerElements.forEach((answerElement) => {
        answerElement.onclick = null;
    });
    
    let correctAnswer = Number(questionsData[currentQuestionIndex].correctAnswer);
    console.log(correctAnswer, selectedAnswerIndex);
    if (selectedAnswerIndex === correctAnswer) {
        score++;
        scoreElement.textContent = `Điểm: ${score}`;
    }
    else{
        answerElements[selectedAnswerIndex].style.backgroundColor = 'red';
    }

    // thay đổi màu sắc của câu trả lời đúng
    answerElements[correctAnswer].style.backgroundColor = 'green';
    

    currentQuestionIndex++;
    if (currentQuestionIndex < questionsData.length) {
        setTimeout(() => {
            

            loadQuestion();
            answerElements.forEach((answerElement) => {
                answerElement.style.backgroundColor = '';
            });
        }, 1500);
    } else {
        scoreElement.textContent = `Điểm: ${score}`;
        alert('Bạn đã hoàn thành bài thi! Điểm của bạn là: ' + score);
    }
}

