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
            questionDiv.className = "question-item";
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

    // PDF-Export mit jsPDF und autoTable
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

        // PDF-Header mit Logo
        doc.addImage("swissport-logo.png", "PNG", 15, 10, 40, 15);
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("Feedback Report", 105, 20, { align: "center" });

        // Meta-Daten Tabelle
        doc.autoTable({
            startY: 35,
            head: [['Kategorie', 'Details']],
            body: [
                ['Feedback-Typ', selectedType],
                ['Bewertende Person', `${evaluatorFirstName} ${evaluatorLastName} (${evaluatorEmployeeNumber})`],
                ['Zu Bewertende Person', `${evaluateeFirstName} ${evaluateeLastName} (${evaluateeEmployeeNumber})`],
                ['Datum der Bewertung', evaluationDate],
                ['Erstellt am', new Date().toLocaleDateString('de-CH')]
            ],
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 123, 255] }
        });

        // Bewertungstabelle
        const questionsData = selectedQuestions.map((question, index) => ({
            Frage: `${index + 1}. ${question}`,
            Bewertung: document.getElementById(`q${index}`).value,
            Kommentar: document.getElementById(`q${index}-comment`).value || '-'
        }));

        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            columns: [
                { header: 'Frage', dataKey: 'Frage' },
                { header: 'Bewertung (1-5)', dataKey: 'Bewertung' },
                { header: 'Kommentar', dataKey: 'Kommentar' }
            ],
            body: questionsData,
            styles: { fontSize: 9 },
            columnStyles: { Kommentar: { cellWidth: 80 } },
            theme: 'striped'
        });

        // Allgemeine Bemerkungen
        doc.setFontSize(12);
        doc.text(`Allgemeine Bemerkungen:`, 15, doc.lastAutoTable.finalY + 15);
        doc.setFont("helvetica", "normal");
        doc.text(generalComments || '-', 15, doc.lastAutoTable.finalY + 25, { maxWidth: 180 });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Erstellt mit SWP Feedback Tool • ${new Date().toLocaleString('de-CH')}`, 
                105, 280, { align: "center" });

        // PDF speichern
        const fileName = `Feedback_${evaluateeLastName}_${new Date().toISOString().slice(0,10)}.pdf`;
        doc.save(fileName);
    });
});
