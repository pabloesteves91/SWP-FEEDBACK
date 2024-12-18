// Lokale Daten
let users = []; // Benutzerliste
let feedbacks = []; // Feedbackliste
let currentUser = null; // Aktuell eingeloggter Benutzer

document.addEventListener("DOMContentLoaded", () => {
    // Login- und Registrierungselemente
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    // Dashboard-Elemente
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackType = document.getElementById("feedbackType");
    const questionsContainer = document.getElementById("questionsContainer");
    const submitFeedback = document.getElementById("submitFeedback");
    const exportPDF = document.getElementById("exportPDF");
    const feedbackHistory = document.getElementById("feedbackHistory");
    const adminSection = document.getElementById("adminSection");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const logoutBtn = document.getElementById("logoutBtn");

    // Admin-Bereich
    const addQuestion = document.getElementById("addQuestion");
    const newQuestionInput = document.getElementById("newQuestion");
    const questionsList = document.getElementById("questionsList");

    // Default-Fragen
    let questions = [
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

    // Umschalten zwischen Login und Registrierung
    if (showRegister) {
        showRegister.addEventListener("click", () => {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
        });
    }

    if (showLogin) {
        showLogin.addEventListener("click", () => {
            registerForm.style.display = "none";
            loginForm.style.display = "block";
        });
    }

    // Registrierung
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            const username = document.getElementById("registerUsername").value.trim();
            const password = document.getElementById("registerPassword").value.trim();
            const role = document.getElementById("registerRole").value;

            if (username && password && role) {
                users.push({ username, password, role });
                alert("Registrierung erfolgreich!");
                registerForm.style.display = "none";
                loginForm.style.display = "block";
            } else {
                alert("Bitte alle Felder ausfüllen!");
            }
        });
    }

    // Login
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const username = document.getElementById("loginUsername").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                currentUser = user;
                localStorage.setItem("currentUser", JSON.stringify(user));
                window.location.href = "dashboard.html";
            } else {
                alert("Ungültige Login-Daten!");
            }
        });
    }

    // Dashboard-Funktionen
    if (feedbackForm) {
        // Benutzer anzeigen
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            usernameDisplay.textContent = currentUser.username;

            if (currentUser.role === "Admin") {
                adminSection.style.display = "block";
            }
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
                questionDiv.classList.add("question");
                questionDiv.innerHTML = `
                    <label>${index + 1}. ${question}</label>
                    <input type="range" min="1" max="5" value="3" class="slider" id="q${index}">
                    <span id="q${index}-value">3</span>
                `;
                questionsContainer.appendChild(questionDiv);

                const slider = questionDiv.querySelector(".slider");
                const valueDisplay = questionDiv.querySelector(`#q${index}-value`);

                slider.addEventListener("input", (e) => {
                    valueDisplay.textContent = e.target.value;
                });
            });
        }

        // Initial generieren
        generateQuestions();

        // Feedback speichern
        submitFeedback.addEventListener("click", () => {
            const feedbackData = {
                user: currentUser.username,
                type: feedbackType.value,
                comments: document.getElementById("comments").value.trim(),
                answers: [],
                date: new Date().toLocaleDateString()
            };

            document.querySelectorAll(".slider").forEach((slider, index) => {
                feedbackData.answers.push({
                    question: questions[index],
                    value: slider.value
                });
            });

            feedbacks.push(feedbackData);
            localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
            alert("Feedback erfolgreich gespeichert!");
            displayFeedbackHistory();
        });

        // Feedback-Verlauf anzeigen
        function displayFeedbackHistory() {
            feedbackHistory.innerHTML = "";
            feedbacks.forEach((fb, index) => {
                const feedbackItem = document.createElement("li");
                feedbackItem.textContent = `${index + 1}. ${fb.user} - ${fb.type} am ${fb.date}`;
                feedbackHistory.appendChild(feedbackItem);
            });
        }

        // PDF-Export
        exportPDF.addEventListener("click", () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const feedbackTypeValue = feedbackType.value;
            const comments = document.getElementById("comments").value.trim();
            let yOffset = 10;

            doc.text("Feedback Bericht", 10, yOffset);
            yOffset += 10;
            doc.text(`Benutzer: ${currentUser.username}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Feedback-Typ: ${feedbackTypeValue}`, 10, yOffset);
            yOffset += 10;

            questions.forEach((question, index) => {
                const value = document.getElementById(`q${index}`).value;
                doc.text(`${index + 1}. ${question}: ${value}`, 10, yOffset);
                yOffset += 10;
            });

            doc.text(`Bemerkungen: ${comments}`, 10, yOffset);
            yOffset += 10;

            doc.save("feedback.pdf");
        });

        // Admin-Fragen verwalten
        if (addQuestion) {
            addQuestion.addEventListener("click", () => {
                const newQuestion = newQuestionInput.value.trim();
                if (newQuestion) {
                    questions.push(newQuestion);
                    generateQuestions();
                    displayQuestionsList();
                    newQuestionInput.value = "";
                } else {
                    alert("Bitte eine Frage eingeben!");
                }
            });
        }

        // Fragen anzeigen
        function displayQuestionsList() {
            questionsList.innerHTML = "";
            questions.forEach((question, index) => {
                const questionItem = document.createElement("li");
                questionItem.textContent = `${index + 1}. ${question}`;
                questionsList.appendChild(questionItem);
            });
        }

        displayFeedbackHistory();
        displayQuestionsList();
    }
});
