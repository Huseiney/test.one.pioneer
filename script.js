// Quiz Questions
const questions = [
    { q: "Define cryptocurrency", choices: ["Digital currency", "Physical money", "Paper money", "Credit"], correct: 0 },
    { q: "Define a coin", choices: ["Blockchain asset", "Token", "Blockchain", "Contract"], correct: 0 },
    { q: "Define a token", choices: ["Utility on a blockchain", "A coin", "Blockchain", "Smart contract"], correct: 0 },
    { q: "Define Blockchain", choices: ["Decentralized ledger", "Token", "Coin", "Contract"], correct: 0 },
    { q: "What is a smart contract?", choices: ["Self-executing agreement", "Token", "Blockchain", "Wallet"], correct: 0 },
    { q: "Define CEX", choices: ["Centralized Exchange", "Coin Exchange", "Contract Exchange", "Crypto Exchange"], correct: 0 },
    { q: "Define DEX", choices: ["Decentralized Exchange", "Digital Exchange", "Direct Exchange", "Decentralized Wallet"], correct: 0 },
    { q: "Explain Testnet", choices: ["Blockchain testing network", "Main blockchain", "Smart contract", "Wallet"], correct: 0 },
    { q: "Explain Mainnet", choices: ["Live blockchain", "Testing blockchain", "Coin", "Token"], correct: 0 },
    { q: "Explain Spot trading", choices: ["Immediate trading", "Futures trading", "Blockchain trading", "Wallet trading"], correct: 0 },
    { q: "What is USDT?", choices: ["Stablecoin", "Coin", "Token", "Smart contract"], correct: 0 },
    { q: "What is an Explorer?", choices: ["Blockchain tracker", "Wallet", "Contract", "DEX"], correct: 0 },
    { q: "What is Slippage tolerance?", choices: ["Price difference allowance", "Token value", "Wallet fee", "Coin change"], correct: 0 },
    { q: "What is ERC20?", choices: ["Ethereum token standard", "Blockchain", "DEX", "Smart contract"], correct: 0 },
    { q: "What is liquidity?", choices: ["Market asset availability", "Coin", "Token", "DEX"], correct: 0 },
];

// DOM Elements
const studentInfo = document.getElementById("studentInfo");
const quizForm = document.getElementById("quizForm");
const startQuizButton = document.getElementById("startQuiz");
const submitQuizButton = document.getElementById("submitQuiz");
const resultDiv = document.getElementById("result");

// Start Quiz
startQuizButton.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const photo = document.getElementById("photo").files[0];

    if (!name || !photo) {
        alert("Please enter your name and upload a photo.");
        return;
    }

    studentInfo.classList.add("hidden");
    quizForm.classList.remove("hidden");
    submitQuizButton.classList.remove("hidden");

    // Render Questions
    questions.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `
            <p>${index + 1}. ${item.q}</p>
            ${item.choices.map((choice, i) => `
                <label>
                    <input type="radio" name="q${index}" value="${i}" required> ${choice}
                </label><br>
            `).join("")}
        `;
        quizForm.appendChild(div);
    });
});

// Submit Quiz
submitQuizButton.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const photo = document.getElementById("photo").files[0];
    const reader = new FileReader();

    const formData = new FormData(quizForm);
    let score = 0;

    const answers = Array.from(formData.entries()).map(([key, value]) => parseInt(value));
    const detailedResult = questions.map((q, index) => {
        const isCorrect = answers[index] === q.correct;
        if (isCorrect) score++;
        return {
            question: q.q,
            correct: q.choices[q.correct],
            yourAnswer: q.choices[answers[index]],
            isCorrect,
        };
    });

    const passFail = score >= (questions.length / 2) ? "PASS" : "FAIL";
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `You scored ${score}/${questions.length}. Status: ${passFail}.`;

    // Send Data to Telegram
    reader.onload = () => {
        const photoBase64 = reader.result.split(',')[1]; // Extract base64
        const telegramApiUrl = `https://api.telegram.org/bot<8174835485:AAF4vGGDqIqKQvVyNrS2EfpbSuo5yhcY2Yo>/sendPhoto`;
        const message = `
            Name: ${name}
            Score: ${score}/${questions.length}
            Status: ${passFail}
        `;

        fetch(telegramApiUrl, {
            method: 'POST',
            body: JSON.stringify({
                chat_id: "<7361816575>",
                photo: photoBase64,
                caption: message,
                parse_mode: 'Markdown',
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then(() => alert("We have successfully received your result!"));
    };

    reader.readAsDataURL(photo);
});
