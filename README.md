# Business Analyst AI Agent (Project BAA)

## Overview
This is an internal AI Agent for ForteBank, designed to analyze business situations, formalize requirements, and support process improvement.

## Project Structure
- `backend/`: FastAPI application (Python) handling AI logic.
- `frontend/`: Vite + React application (TypeScript) for the user interface.

## Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API Key
- Docker (optional, for containerized deployment)

## Setup & Running Locally

### 1. Backend Setup
Navigate to the backend directory and set up the virtual environment:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Configure OpenAI API Key:**
```bash
export OPENAI_API_KEY='your-api-key-here'
```

Start the backend server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
Navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:5173`.

## Features (MVP)
1.  **Diagnosis (A-1)**: Root Cause Analysis using "5 Whys" or "Fishbone".
2.  **Requirements (R-2)**: Formalize user requests into User Stories.
3.  **Process (P-2)**: Generate BPMN diagrams (Planned).

## Tech Stack
- **LLM**: OpenAI GPT-4o-mini
- **Backend**: FastAPI
- **Frontend**: React + Vite + TypeScript
- **Style**: ForteBank Corporate Identity (Cherry/Gold)
