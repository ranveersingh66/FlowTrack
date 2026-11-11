# FlowTrack

FlowTrack is a responsive menstrual cycle tracker that helps users record cycle details, view predicted periods and fertile windows, log daily symptoms, and receive personalized tips.

## Features

- Guided onboarding for age, period dates, duration, flow, symptoms, and cycle length
- Menstrual, follicular, ovulation, and luteal phase tracking
- Cycle-length-aware predictions for different cycle lengths
- Four-month calendar view with:
  - Actual period days
  - Predicted period days
  - Estimated fertile windows
- Daily symptom and flow logging
- Personalized tips based on cycle phase, cycle day, symptoms, and flow intensity
- Local browser storage using `localStorage`
- Responsive layout for desktop, tablet, and mobile screens

## Getting Started

1. Clone or download the repository.
2. Open `index.html` in a modern web browser.
3. Complete the onboarding setup.
4. Use the dashboard and daily symptom logger to track your cycle.

No build tools, server, or external dependencies are required.

## Project Structure

```text
Period-Tracker/
├── index.html    # Application markup and UI structure
├── style.css     # Layout, theme, and responsive styles
├── script.js     # Cycle calculations, calendar rendering, and interactions
└── README.md     # Project documentation
```

## Privacy

FlowTrack stores setup information and daily logs locally in the browser. No backend or external data service is used.

## Disclaimer

FlowTrack is intended for personal tracking and educational purposes. Its predictions and suggestions are estimates and are not medical advice or a diagnosis.
