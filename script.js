let users = []; // Benutzerliste
let feedbacks = []; // Feedbackliste
let currentUser = null; // Aktuell eingeloggter Benutzer

document.addEventListener("DOMContentLoaded", () => {
    // Login-Funktionalität
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const loginBtn = document.getElementById("loginBtn");
    const loginError = document.getElementById("loginError");

    // Dashboard-Elemente
    const feedbackType = document.getElementById("feedbackType");
    const questionsContainer = document.getElementById("questionsContainer");
    const submitFeedback = document.getElementById("submitFeedback");
    const exportPDF = document.getElementById("exportPDF");
    const logoutBtn = document.getElementById("logoutBtn");
    const usernameDisplay = document.getElementById("usernameDisplay");

    // Default-Fragen
    const questions = [
        "Kommunikation",
        "Teamarbeit",
        "Zuverlässigkeit",
        "Pünktlichkeit",
        "Engagement",
        "Fachkenntnisse",
        "Selbstständigkeit",
        "Kreativität",
        "Problemlösung",
        "Führungskompetenz"
    ];

    // Benutzer aus JSON laden
    fetch("users.json")
        .then(response => response.json())
        .then(data => {
            users = data;
        });

    // Login-Funktion
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const username = loginUsername.value.trim();
            const password = loginPassword.value.trim();

            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                currentUser = user;
                localStorage.setItem("currentUser", JSON.stringify(user));
                window.location.href = "dashboard.html";
            } else {
                loginError.style.display = "block";
            }
        });
    }

    // Dashboard-Funktionen
    if (feedbackType) {
        // Benutzer anzeigen
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            usernameDisplay.textContent = currentUser.username;
        } else {
            alert("Bitte einloggen!");
            window.location.href = "index.html";
        }

        // Logout
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });

        // Fragen generieren
        function generateQuestions() {
            questionsContainer.innerHTML = "";
            questions.forEach((question, index) => {
                const questionDiv = document.createElement("div");
                questionDiv.innerHTML = `
                    <label>${index + 1}. ${question}</label>
                    <input type="range" min="1" max="5" value="3" class="slider" id="q${index}">
                `;
                questionsContainer.appendChild(questionDiv);
            });
        }

        // Initial generieren
        generateQuestions();

        // Feedback speichern
        submitFeedback.addEventListener("click", () => {
            const feedbackData = {
                user: currentUser.username,
                type: feedbackType.value,
                date: new Date().toLocaleDateString(),
                comments: document.getElementById("comments").value,
                answers: Array.from(document.querySelectorAll(".slider")).map((slider, i) => ({
                    question: questions[i],
                    value: slider.value
                }))
            };

            feedbacks.push(feedbackData);
            alert("Feedback gespeichert!");
        });

        // PDF-Export
        exportPDF.addEventListener("click", () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.text(`Feedback von ${currentUser.username}`, 10, 10);
            doc.text(`Typ: ${feedbackType.value}`, 10, 20);

            questions.forEach((question, i) => {
                const value = document.getElementById(`q${i}`).value;
                doc.text(`${i + 1}. ${question}: ${value}`, 10, 30 + i * 10);
            });

            doc.save("feedback.pdf");
        });
    }
});
