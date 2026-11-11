# FlowTrack

FlowTrack is an open-source, privacy-first menstrual cycle tracking web application built to help users monitor cycle phases, predict period and fertility windows, log daily symptoms, and receive phase-specific health suggestions—all with zero external server dependencies or data tracking.

## 🎯 Purpose & Ecosystem Impact
Personal health data privacy is a critical concern. Most commercial tracking applications rely on backend databases, user accounts, and telemetry scripts. FlowTrack provides a lightweight, transparent alternative that runs entirely inside the user's browser, keeping sensitive personal health logs completely private and stored strictly in local browser storage (`localStorage`).

## 🚀 Key Features
- **Phase-Aware Cycle Tracking:** Monitors Menstrual, Follicular, Ovulation, and Luteal phases dynamically based on individual cycle parameters.
- **Visual Calendar Interface:** Generates a 4-month interactive calendar displaying actual period dates, predicted future cycles, and estimated fertile windows.
- **Daily Health Logger:** Enables users to log daily symptoms, flow intensity, and notes with immediate, phase-tailored wellness tips.
- **Zero-Dependency Architecture:** Pure native web technologies (HTML5, CSS3, JavaScript) with no heavy frameworks, backend APIs, or external build tools required.
- **Privacy-Centric:** All personal data is saved locally on the user's device via `localStorage`—no accounts, no tracking scripts, and no server calls.
- **Responsive Design:** Optimized layout for desktop, tablet, and mobile screens.

## 📁 Project Structure
```text
FlowTrack/
├── index.html    # Application markup and accessible UI structure
├── style.css     # CSS variables, layout grid, and responsive styling
├── script.js     # Cycle algorithms, calendar rendering engine, and local storage
└── README.md     # Project documentation

Quick Start
Clone the repository: git clone https://github.com/ranveersingh66/FlowTrack.git

Open index.html directly in any modern web browser.

Complete the onboarding setup to begin tracking.

⚠️ Disclaimer
FlowTrack is designed for personal tracking and educational purposes. Predictions and suggestions are statistical estimates based on user inputs and do not constitute medical advice or clinical diagnosis.

📄 License
MIT License
