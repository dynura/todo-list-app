# Stay Organized! To-Do Widget

A beautiful, pastel-themed pixel-art desktop to-do widget built with **React**, **TypeScript**, and **Electron**. Features a dynamic completion milestone banner, an interactive pixel cat avatar that jumps when tasks are completed, custom frameless window controls, and satisfying pixelated audio effects.

---

## Features

- **Pixel Art Design:** Styled entirely with the `Silkscreen` monospace font and crisp pixel assets.
- **Dynamic Completion Milestones:** Celebrates your productivity with responsive banners like *"Add some tasks to get started!"*, *"Making progress! Keep it up!"*, and *"All tasks completed! Great job!"*.
- **Interactive Cat Avatar:** An integrated pixel cat companion that tracks your completion status and jumps with joy when you finish a task.
- **Hover Action Interactivity:** Clean layout rows where edit and delete buttons stay hidden to keep the view neat, revealing themselves smoothly only when you hover your mouse pointer over the specific row.
- **Frameless Window Setup:** Customized header bar handles window dragging natively, alongside functional minimize, maximize, and close buttons powered by Electron IPC bridging.

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone or copy this repository to your local directory.
2. Open your terminal in the project directory and install the necessary dependencies:
   ```bash
   npm install

### Running the App
To start the application in development mode (launches the React local development server alongside the Electron window container simultaneously):
   ```bash
   npm run electron-dev
