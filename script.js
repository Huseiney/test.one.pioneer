// Quiz Questions
const questions = [
    { q: "Define cryptocurrency", choices: ["Digital currency", "Physical money", "Paper money", "Credit"], correct: 0 },
    { q: "Define a coin", choices: ["Blockchain asset", "Token", "Blockchain", "Contract"], correct: 0 },
    // Add remaining questions here...
];

const form = document.getElementById("quizForm");

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
    form.appendChild(div);
});

// Handle Quiz Submission
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
    }).then(() => alert("Results sent to Telegram!"));
});
