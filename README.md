# Ryze AI – Deterministic Multi-Step UI Generator

## Overview

Ryze AI is a deterministic, multi-step AI agent that converts natural language UI intent into structured React UI code with live preview, iterative modification support, and version rollback.

The system enforces strict component constraints to ensure consistent rendering and controlled generation.

---

## Architecture Overview

The system follows a multi-step orchestration pattern:

User Intent  
→ Planner  
→ Generator  
→ Validator  
→ Explainer  
→ Version Store  
→ Live Preview  

### Backend

- Express API under `/api`
- Planner produces structured `uiPlan`
- Generator converts plan to JSX
- Validator enforces deterministic constraints
- Explainer summarizes changes
- In-memory version store enables rollback

### Frontend

- Left panel: Prompt + Version history
- Center panel: Live preview
- Right panel: Editable generated code
- Safe preview from both structured plan and edited code

---

## Agent Design & Prompts

### Planner
- Converts user intent + previous plan into structured JSON
- Preserves layout unless explicitly modified
- Uses only allowed components

### Generator
- Converts `uiPlan` into valid React JSX
- Imports only used components
- No inline styles
- No arbitrary HTML
- No new component definitions
- Single retry on validation failure

### Explainer
- Produces concise bullet-point explanation
- Describes changes relative to previous version

---

## Component System Design

Fixed deterministic component library:

- Button  
- Card  
- Input  
- Modal  
- Sidebar  
- Navbar  
- Table  
- Chart  

AI cannot:
- Create new components
- Inject CSS
- Use external UI libraries
- Add inline styles

Validator enforces:
- Whitelisted components only
- No disallowed HTML
- No unused imports
- No unsafe patterns

This guarantees consistent rendering behavior.

---

## Iteration Support

The system supports incremental modifications:

- Preserves existing layout
- Applies targeted changes
- Explains what changed
- Creates new version
- Supports rollback to any previous version

---

## Known Limitations

- In-memory storage (resets on restart)
- Limited manual code parsing for preview
- No authentication
- No persistent database

These tradeoffs prioritize determinism and correctness within the project scope.

---

## What I Would Improve With More Time

- Persistent database-backed version storage
- Version diff visualization
- Stronger schema validation
- More aesthetic UI
---

## Technical Stack

Frontend:
- React (Vite)
- Vanilla CSS

Backend:
- Node.js
- Express
- Gemini LLM API
- In-memory version store

Deployment:
- Backend: Render
- Frontend: Netlify

---

## Setup

### Backend
####
    cd backend
    npm install
    npm run dev 

- create '.env'  :
####
    GEMINI_API_KEY=YOUR_KEY
    GEMINI_MODEL=gemini-3-flash-preview

### Frontend
####
    cd frontend
    npm install
    npm run dev 

- create '.env' :
####
    VITE_API_BASE=http://localhost:5000