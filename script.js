document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const feedbackType = document.getElementById("feedbackType");
    const feedbackForm = document.getElementById("feedbackForm");
    const questionsContainer = document.getElementById("questionsContainer");
    const exportPDF = document.getElementById("exportPDF");

    const evaluatorFields = [
        "evaluatorFirstName",
        "evaluatorLastName",
        "evaluatorEmployeeNumber",
        "evaluationDate",
        "evaluateeFirstName",
        "evaluateeLastName",
        "evaluateeEmployeeNumber"
    ];

    const questionsOptions = {
        "Mitarbeiter zu Supervisor": [
            "Führungskompetenz",
            "Kommunikation",
            "Problemlösung",
            "Motivation",
            "Vertrauen"
        ],
        "Supervisor zu Mitarbeiter": [
            "Teamarbeit",
            "Pünktlichkeit",
            "Zuverlässigkeit",
            "Fachkenntnisse",
            "Sicherheit"
        ]
    };

    let selectedQuestions = [];

    // Schritt 1: Feedback-Art auswählen
    startBtn.addEventListener("click", () => {
        const selectedType = feedbackType.value;

        if (!selectedType) {
            alert("Bitte wählen Sie aus, wer wen bewertet.");
            return;
        }

        selectedQuestions = questionsOptions[selectedType];
        document.getElementById("initialSection").style.display = "none";
        feedbackForm.style.display = "block";
        generateQuestions();
    });

    // Dynamisches Erstellen der Fragen
    function generateQuestions() {
        questionsContainer.innerHTML = "";
        selectedQuestions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <label>${index + 1}. ${question}</label>
                <input type="range" min="1" max="5" value="3" class="slider" id="q${index}">
                <span id="q${index}-value">3</span>
                <textarea id="q${index}-comment" placeholder="Kommentar zu dieser Frage (optional)"></textarea>
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

    // Pflichtfeldprüfung
    function validateFields() {
        let allValid = true;
        evaluatorFields.forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (!field.value || (fieldId.includes("EmployeeNumber") && field.value.length !== 6)) {
                allValid = false;
            }
        });
        exportPDF.disabled = !allValid;
    }

    evaluatorFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        field.addEventListener("input", validateFields);
    });

    // PDF-Export
    exportPDF.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const selectedType = feedbackType.value;
        const evaluatorFirstName = document.getElementById("evaluatorFirstName").value;
        const evaluatorLastName = document.getElementById("evaluatorLastName").value;
        const evaluatorEmployeeNumber = document.getElementById("evaluatorEmployeeNumber").value;
        const evaluateeFirstName = document.getElementById("evaluateeFirstName").value;
        const evaluateeLastName = document.getElementById("evaluateeLastName").value;
        const evaluateeEmployeeNumber = document.getElementById("evaluateeEmployeeNumber").value;
        const evaluationDate = document.getElementById("evaluationDate").value;
        const generalComments = document.getElementById("generalComments").value;
        const timestamp = new Date().toLocaleTimeString();

        let yOffset = 20;

        doc.setFontSize(20);
        doc.text("SWP Feedback", 105, yOffset, { align: "center" });
        yOffset += 20;

        doc.addImage("swissport-logo.png", "PNG", 80, 10, 50, 20);

        doc.setFontSize(12);
        doc.text(`Feedback-Typ: ${selectedType}`, 20, yOffset);
        yOffset += 10;

        doc.text(`Bewertender: ${evaluatorFirstName} ${evaluatorLastName} (${evaluatorEmployeeNumber})`, 20, yOffset);
        yOffset += 10;

        doc.text(`Zu Bewertender: ${evaluateeFirstName} ${evaluateeLastName} (${evaluateeEmployeeNumber})`, 20, yOffset);
        yOffset += 10;

        doc.text(`Datum: ${evaluationDate}`, 20, yOffset);
        yOffset += 10;

        doc.text(`Zeitstempel: ${timestamp}`, 20, yOffset);
        yOffset += 20;

        selectedQuestions.forEach((question, index) => {
            const value = document.getElementById(`q${index}`).value;
            const comment = document.getElementById(`q${index}-comment`).value;
            doc.text(`${index + 1}. ${question}: ${value}`, 20, yOffset);
            yOffset += 10;
            if (comment) {
                doc.text(`Kommentar: ${comment}`, 30, yOffset);
                yOffset += 10;
            }
        });

        doc.text(`Allgemeine Bemerkungen: ${generalComments}`, 20, yOffset);

        const fileName = `feedback-${evaluateeFirstName}-${evaluateeLastName}.pdf`;
        doc.save(fileName);
    });
});
