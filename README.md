# 🚀 AI Resume Analyzer - Frontend

This directory contains the source code for the frontend of the AI-Powered Resume Analyzer. It is a modern, responsive Single-Page Application (SPA) built with **React** and **Vite**, and styled with **Tailwind CSS**.

## ✨ Features

- **Role-Based UI**: The interface dynamically adapts to the logged-in user's role (Student, HR, or Admin).
- **Interactive Dashboards**: Visualizes user data with insightful metrics and charts using Chart.js.
- **Asynchronous Workflows**: Supports complex, multi-step user journeys for creating and completing assessments.
- **Secure Token Handling**: Manages JWT tokens for session persistence and secure communication with the backend API.
- **Responsive Design**: A mobile-first approach ensures a seamless experience across all devices.

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 18, Vite | Fast, modern, and efficient UI development |
| **Styling** | Tailwind CSS | A utility-first CSS framework for rapid styling |
| **Routing** | React Router DOM | Client-side routing for a seamless SPA experience |
| **State Management** | React Context API | Centralized state management for user authentication |
| **Data Fetching** | Axios | Promise-based HTTP client for API communication |
| **Charts** | Chart.js, react-chartjs-2 | Creating interactive and responsive charts |
| **Linting** | ESLint | Code quality and consistency |

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and **npm**
- A running instance of the **backend API**.

### Installation and Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js Dependencies:**
   This command will install all the required packages listed in `package.json`.
   ```bash
   npm install
   ```

3. **Create an Environment File:**
   Create a `.env` file in the `frontend` root directory. This file will store the URL of your backend API.
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. **Run the Frontend Development Server:**
   This command starts the Vite development server with hot-reloading.
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## 📁 Project Structure

The `src` directory is organized to separate concerns and improve maintainability.

```
frontend/
└── src/
    ├── 📁 api/              # Axios instance configuration
    ├── 📁 components/       # Reusable UI components (Layout, MetricCard, etc.)
    ├── 📁 context/          # React Context for global state (AuthContext)
    ├── 📁 pages/            # Top-level page components (Dashboard, Login, Report, etc.)
    ├── App.jsx             # Main application router setup
    ├── index.css           # Global styles and Tailwind CSS directives
    └── main.jsx            # Application entry point
```

## ⚙️ Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Bundles the app into static files for production in the `dist` folder.
- `npm run lint`: Runs the linter to check for code quality issues.
- `npm run preview`: Serves the production build locally to preview it before deployment.

## 🤝 State Management

The application uses **React's Context API** for global state management, primarily for user authentication.

- `AuthContext.jsx`: This context provider is wrapped around the entire application in `main.jsx`. It is responsible for:
  - Storing the current user's data and JWT token.
  - Providing `login` and `logout` functions to all components.
  - Persisting the user's session by reading the token from `localStorage` on initial load.

Component-level state is managed using the `useState` and `useEffect` hooks.