const contestants = [
    {
        name: "Nguyễn Văn A",
        topic: "Ứng dụng AI trong Nông Nghiệp",
        image: "image/LG Display.PNG"
    },
    {
        name: "Trần Thị B", 
        topic: "Giải Pháp Môi Trường Thông Minh",
        image: "https://via.placeholder.com/250x300"
    },
    {
        name: "Lê Văn C",
        topic: "Hệ Thống Giao Thông Tự Động", 
        image: "https://via.placeholder.com/250x300"
    },
    {
        name: "Hoàng Văn D",
        topic: "Robot Hỗ Trợ Y Tế",
        image: "https://via.placeholder.com/250x300"
    },
    {
        name: "Vũ Thị E",
        topic: "Ứng Dụng Blockchain Trong Giáo Dục",
        image: "https://via.placeholder.com/250x300"
    },
    {
        name: "Ngô Văn F",
        topic: "Hệ Thống Năng Lượng Mặt Trời Thông Minh",
        image: "https://via.placeholder.com/250x300"
    },
    {
        name: "Đỗ Thị G",
        topic: "Phần Mềm Quản Lý Môi Trường",
        image: "https://via.placeholder.com/250x300"
    },
    {
        name: "Trương Văn H",
        topic: "Giải Pháp IoT Trong Nông Nghiệp",
        image: "https://via.placeholder.com/250x300"
    }
];

let currentContestantIndex = 0;
let currentJudgeName = '';

const nameEl = document.getElementById('contestantName');
const topicEl = document.getElementById('contestantTopic');
const imageEl = document.getElementById('contestantImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const saveBtn = document.getElementById('saveBtn');
const judgeNameInput = document.getElementById('judgeNameInput');
const innovationInput = document.getElementById('innovationScore');
const presentationInput = document.getElementById('presentationScore');
const technicalInput = document.getElementById('technicalScore');
const totalScoreEl = document.getElementById('totalScore');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const popupMessage = document.getElementById('popupMessage');
const closePopupBtn = document.getElementById('closePopupBtn');

// Error message elements
const innovationErrorEl = document.getElementById('innovationError');
const presentationErrorEl = document.getElementById('presentationError');
const technicalErrorEl = document.getElementById('technicalError');

function validateScore(input, errorEl) {
    const value = +input.value;
    const min = +input.min;
    const max = +input.max;

    // Clear previous error
    input.classList.remove('invalid');
    errorEl.textContent = '';

    // Check if input is empty
    if (input.value.trim() === '') {
        input.classList.add('invalid');
        errorEl.textContent = 'Vui lòng nhập điểm';
        return false;
    }

    // Check if value is a number
    if (isNaN(value)) {
        input.classList.add('invalid');
        errorEl.textContent = 'Vui lòng nhập số';
        return false;
    }

    // Check if value is within range
    if (value < min || value > max) {
        input.classList.add('invalid');
        errorEl.textContent = `Điểm phải từ ${min} đến ${max}`;
        return false;
    }

    return true;
}

function validateAllScores() {
    const innovationValid = validateScore(innovationInput, innovationErrorEl);
    const presentationValid = validateScore(presentationInput, presentationErrorEl);
    const technicalValid = validateScore(technicalInput, technicalErrorEl);

    return innovationValid && presentationValid && technicalValid;
}

function updateContestantDisplay() {
    const contestant = contestants[currentContestantIndex];
    nameEl.textContent = contestant.name;
    topicEl.textContent = contestant.topic;
    imageEl.src = contestant.image;

    // Reset score inputs and errors
    innovationInput.value = '';
    presentationInput.value = '';
    technicalInput.value = '';
    innovationErrorEl.textContent = '';
    presentationErrorEl.textContent = '';
    technicalErrorEl.textContent = '';
    innovationInput.classList.remove('invalid');
    presentationInput.classList.remove('invalid');
    technicalInput.classList.remove('invalid');

    // Update navigation buttons
    prevBtn.disabled = currentContestantIndex === 0;
    nextBtn.disabled = currentContestantIndex === contestants.length - 1;

    // Reset total score
    totalScoreEl.textContent = '0';
}

function calculateTotalScore() {
    if (!validateAllScores()) {
        totalScoreEl.textContent = '0';
        return;
    }

    const innovation = +innovationInput.value || 0;
    const presentation = +presentationInput.value || 0;
    const technical = +technicalInput.value || 0;
    const totalScore = innovation + presentation + technical;
    totalScoreEl.textContent = totalScore.toFixed(1);
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function closePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

function saveScore() {
    // Validate judge name
    const judgeName = judgeNameInput.value.trim();
    if (!judgeName || judgeName === "Chọn Giám Khảo") {
        alert('Vui lòng chọn tên người chấm');
        return;
    }

    // Validate all scores
    if (!validateAllScores()) {
        alert('Vui lòng kiểm tra lại điểm số');
        return;
    }

    const contestant = contestants[currentContestantIndex];
    const scoreData = {
        judgeName: judgeName,
        name: contestant.name,
        topic: contestant.topic,
        innovationScore: +innovationInput.value,
        presentationScore: +presentationInput.value,
        technicalScore: +technicalInput.value,
        totalScore: +totalScoreEl.textContent
    };

    try {
        // Thay thế URL này bằng URL của Google Apps Script của bạn
        fetch('https://script.google.com/macros/s/AKfycbwvUk2QSyE1jXFmZLC3BCiHPSDN-5NuRcLUkL2CTE2KjnZ7hgmz7N2-DRqGN722HKDiKA/exec', {
            method: 'POST',
            body: JSON.stringify(scoreData)
        })
        .then(response => {
            if (response.ok) {
                showPopup(`Đã chấm điểm cho thí sinh ${contestant.name} thành công!`);
            } else {
                throw new Error('Lỗi khi lưu điểm');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Lỗi: ' + error.message);
        });
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

prevBtn.addEventListener('click', () => {
    if (currentContestantIndex > 0) {
        currentContestantIndex--;
        updateContestantDisplay();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentContestantIndex < contestants.length - 1) {
        currentContestantIndex++;
        updateContestantDisplay();
    }
});

saveBtn.addEventListener('click', saveScore);
closePopupBtn.addEventListener('click', closePopup);

judgeNameInput.addEventListener('change', updateContestantDisplay);

[innovationInput, presentationInput, technicalInput].forEach(input => {
    input.addEventListener('input', () => {
        validateScore(input, 
            input === innovationInput ? innovationErrorEl :
            input === presentationInput ? presentationErrorEl : 
            technicalErrorEl
        );
        calculateTotalScore();
    })})