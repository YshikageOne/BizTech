# BizTech

## Project Overview

BizTech is a mobile application built with Expo and React Native that provides business analytics and order management features. It leverages Firebase for backend services and Chart.js for data visualization.

## Features

- Authentication and data storage via Firebase
- Interactive charts and dashboards using Chart.js and react-chartjs-2
- Order manifest generation with a custom script
- Cross-platform support (iOS, Android, Web)

## Tech Stack

- **Framework:** React Native (0.79.2)
- **CLI & Routing:** Expo CLI, Expo Router
- **Charts:** Chart.js (4.x), react-chartjs-2, react-native-chart-kit
- **Backend:** Firebase
- **State & Utilities:** Lodash, Moti animations, Expo libraries (Blur, Haptics, Image, Splash Screen)
- **Navigation:** React Navigation (bottom-tabs, stack)

## Prerequisites

- Node.js v14 or higher
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YshikageOne/BizTech.git
   cd BizTech
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run start
   ```
4. To run on a specific platform:
   ```bash
   npm run android   # Android emulator or device
   npm run ios       # iOS simulator
   npm run web       # Web browser
   ```

## Available Scripts

- `npm run start` — Launch Expo development tools
- `npm run android` — Build and run on Android
- `npm run ios` — Build and run on iOS
- `npm run web` — Build and run in the web browser
- `npm run lint` — Run ESLint
- `npm run reset-project` — Reset project state (custom script)
- `npm run generate:orders` — Generate orders manifest (custom script)

## Project Structure

```
├── .expo/                # Expo project files
├── .vscode/              # VSCode settings
├── app/                  # Application source code (screens, layouts)
├── assets/               # Images, fonts, icons
├── scripts/              # Custom scripts (reset, generate orders)
├── package.json          # Project metadata and scripts
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript configuration
└── eslint.config.js      # ESLint configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: \`git commit -m "Add YourFeature"
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request



