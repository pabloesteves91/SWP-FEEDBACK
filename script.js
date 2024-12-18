document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const feedbackType = document.getElementById("feedbackType");
    const feedbackForm = document.getElementById("feedbackForm");
    const questionsContainer = document.getElementById("questionsContainer");
    const submitFeedback = document.getElementById("submitFeedback");
    const exportPDF = document.getElementById("exportPDF");

    // Standard-Fragen
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

    // Schritt 1: Feedback-Art auswählen
    startBtn.addEventListener("click", () => {
        const selectedType = feedbackType.value;

        if (!selectedType) {
            alert("Bitte wählen Sie aus, wer wen bewertet.");
            return;
        }

        document.getElementById("initialSection").style.display = "none";
        feedbackForm.style.display = "block";
        generateQuestions();
    });

    // Dynamisches Erstellen der Fragen
    function generateQuestions() {
        questionsContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <label>${index + 1}. ${question}</label>
                <input type="range" min="1" max="5" value="3" class="slider" id="q${index}">
                <span id="q${index}-value">3</span>
            `;
            questionsContainer.appendChild(questionDiv);

            // Aktualisieren des Werte-Anzeigers
            const slider = questionDiv.querySelector(".slider");
            const valueDisplay = questionDiv.querySelector(`#q${index}-value`);
            slider.addEventListener("input", (e) => {
                valueDisplay.textContent = e.target.value;
            });
        });
    }

    // Feedback speichern (optional)
    submitFeedback.addEventListener("click", () => {
        alert("Feedback gespeichert! (Diese Funktion speichert lokal und kann später erweitert werden.)");
    });

    // PDF-Export
    exportPDF.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const selectedType = feedbackType.value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const employeeNumber = document.getElementById("employeeNumber").value;
        const evaluationDate = document.getElementById("evaluationDate").value;
        const comments = document.getElementById("comments").value;

        doc.text("Feedback Bericht", 10, 10);
        doc.text(`Feedback-Typ: ${selectedType}`, 10, 20);
        doc.text(`Vorname: ${firstName}`, 10, 30);
        doc.text(`Nachname: ${lastName}`, 10, 40);
        doc.text(`Personalnummer: ${employeeNumber}`, 10, 50);
        doc.text(`Datum: ${evaluationDate}`, 10, 60);

        let yOffset = 70;
        questions.forEach((question, index) => {
            const value = document.getElementById(`q${index}`).value;
            doc.text(`${index + 1}. ${question}: ${value}`, 10, yOffset);
            yOffset += 10;
        });

        doc.text(`Bemerkungen: ${comments}`, 10, yOffset);

        doc.save("feedback.pdf");
    });
});
