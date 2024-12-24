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

// Render Questions
const form = document.getElementById("quizForm");

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
    form.appendChild(div);
});

// Quiz Submission Logic (unchanged)
document.getElementById("submitQuiz").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const formData = new FormData(form);
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

    // Display Result
    const passFail = score >= (questions.length / 2) ? "PASS" : "FAIL";
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `You scored ${score}/${questions.length}. Status: ${passFail}.`;

    // Enable Download Button
    const downloadBtn = document.getElementById("downloadResult");
    downloadBtn.classList.remove("hidden");

    // Download Result as PDF
    downloadBtn.addEventListener("click", () => {
        const resultText = detailedResult.map(r => `
            Question: ${r.question}
            Correct Answer: ${r.correct}
            Your Answer: ${r.yourAnswer}
            Status: ${r.isCorrect ? "Correct" : "Incorrect"}
        `).join("\n");

        const doc = new jsPDF();
        doc.text(`Pioneer Crypto Academy Quiz Results`, 10, 10);
        doc.text(`Score: ${score}/${questions.length} (${passFail})`, 10, 20);
        doc.text(resultText, 10, 30);
        doc.save("quiz-results.pdf");
    });

    // Send Results to Telegram
    const botId = "7361816575";
    const botToken = "8174835485:AAF4vGGDqIqKQvVyNrS2EfpbSuo5yhcY2Yo";
    const chatId = botId;

    const resultMessage = detailedResult.map(r => `
        Question: ${r.question}
        Correct Answer: ${r.correct}
        Your Answer: ${r.yourAnswer}
        Status: ${r.isCorrect ? "Correct" : "Incorrect"}
    `).join("\n");

    const message = `
        Name: [Student Name]
        Phone: [Phone Number]
        Result: ${score}/${questions.length}
        ${resultMessage}
    `;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
    }).then(() => alert("Your result has been saved in our system."));
});
