document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const initialSection = document.getElementById("initialSection");
    const feedbackForm = document.getElementById("feedbackForm");
    const questionsContainer = document.getElementById("questions");
    const calculateBtn = document.getElementById("calculateBtn");
    const exportBtn = document.getElementById("exportPDF");
    const outputDiv = document.getElementById("output");

    const questions = [
        "Kommunikation", "Teamarbeit", "Zuverlässigkeit", "Pünktlichkeit",
        "Engagement", "Fachkenntnisse", "Selbstständigkeit", "Kreativität",
        "Problemlösung", "Führungskompetenz"
    ];

    startBtn.addEventListener("click", () => {
        const evaluatorType = document.getElementById("evaluatorType").value;
        if (!evaluatorType) {
            alert("Bitte Bewertungsart auswählen!");
            return;
        }
        initialSection.style.display = "none";
        feedbackForm.style.display = "block";
        generateSliders();
    });

    function generateSliders() {
        questionsContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const sliderDiv = document.createElement("div");
            sliderDiv.classList.add("slider-container");

            sliderDiv.innerHTML = `
                <label>${index + 1}. ${question}:</label>
                <input type="range" min="1" max="5" value="3" class="slider" id="q${index + 1}">
                <span id="q${index + 1}-value">3</span>
            `;

            questionsContainer.appendChild(sliderDiv);

            sliderDiv.querySelector(".slider").addEventListener("input", (e) => {
                document.getElementById(`q${index + 1}-value`).innerText = e.target.value;
            });
        });
    }

    calculateBtn.addEventListener("click", calculateAverage);

    function calculateAverage() {
        let total = 0;
        const sliders = document.querySelectorAll(".slider");
        sliders.forEach(slider => total += parseInt(slider.value));
        const average = (total / sliders.length).toFixed(2);

        outputDiv.innerHTML = `
            <p><strong>Durchschnittliche Bewertung:</strong> ${average}</p>
            <p class="output-label">${average >= 3 ? "Eher positiv" : "Eher negativ"}</p>
        `;

        return average;
    }

    exportBtn.addEventListener("click", exportToPDF);

    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const evaluatorType = document.getElementById("evaluatorType").value;
        const average = calculateAverage();

        doc.text("Feedback Auswertung", 10, 10);
        doc.text(`Bewertungsart: ${evaluatorType}`, 10, 20);
        doc.text(`Durchschnitt: ${average}`, 10, 30);
        doc.save("feedback.pdf");
    }
});
