# SWP Feedback

Eine moderne Web-App zur Erfassung und Bewertung von Mitarbeitern und Supervisoren. Die App ermöglicht die einfache Eingabe von Feedback, generiert ein professionell gestaltetes PDF und bietet eine benutzerfreundliche Oberfläche.

---

## **Features**

1. **Benutzerfreundliche Oberfläche**:
   - Auswahl, wer wen bewertet (Mitarbeiter -> Supervisor oder Supervisor -> Mitarbeiter).
   - Pflichtfelder für persönliche Informationen.
   - Dynamische Fragen je nach Bewertungsrichtung.

2. **Dynamischer PDF-Export**:
   - Professionell gestaltetes PDF mit Logo.
   - Enthält alle Bewertungsdaten, inklusive Kommentaren und Zeitstempel.
   - PDF wird unter dem Namen `feedback-[Name des Bewerteten].pdf` gespeichert.

3. **Echtzeit-Prüfungen**:
   - Pflichtfelder (z. B. 6-stellige Personalnummer) werden validiert.
   - Der Export-Button wird nur aktiviert, wenn alle erforderlichen Felder ausgefüllt sind.

4. **Responsive Design**:
   - Modernes, mobilfreundliches Layout.

---

## **Verwendete Technologien**

- **HTML5**: Struktur der App.
- **CSS3**: Modernes Design und Styling.
- **JavaScript (Vanilla)**: Interaktive Logik und PDF-Export.
- **jsPDF**: Erzeugung des PDF-Dokuments.
