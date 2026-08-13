# AI Tool for Early-Stage Dementia & Cognitive Detection

An accessible, non-invasive screening tool for early dementia detection powered by speech fluency analytics, short-term memory recall tests, and cognitive reaction latency monitoring.

---

## 📁 Repository Structure

```
├── frontend/                 # React + Vite Client Application
│   ├── public/               # Static assets & icons
│   ├── src/                  # React components, pages, context & i18n translations
│   ├── index.html            # Main HTML entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies & scripts
│
├── backend/                  # Node.js + Express API Server
│   ├── src/                  # Express routes, controllers, auth & scoring engine
│   ├── migrations/           # PostgreSQL database schema & seed scripts
│   ├── docs/                 # API contract documentation
│   ├── migrate.js            # Database migration CLI runner
│   ├── server.js             # API server entry point
│   └── package.json          # Backend dependencies & scripts
│
├── package.json              # Root workspace package runner
├── .env.example              # Environment variables blueprint
└── README.md                 # Main project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Optional for local backend persistence

### 2. Installation
Install all dependencies for both frontend and backend:
```bash
npm install
```

---

## 🏃 Running the Application

### Frontend Development Server (React + Vite)
```bash
npm run dev:frontend
```
App runs at: `http://localhost:5173`

### Backend API Server (Node + Express)
```bash
npm run dev:backend
# Or start production mode:
npm run start:backend
```
API server runs at: `http://localhost:5000`

---

## 🗄️ Database Setup & Migrations (Backend)

1. Configure environment variables in `backend/.env` (refer to `.env.example`).
2. Run database setup:
```bash
npm run setup:backend
```

---

## 🧪 Testing & Builds

### Build Frontend Distribution Bundle
```bash
npm run build:frontend
```

---

## 📄 License
[MIT License](LICENSE)
