# CloudServe: Enterprise IT Service & Incident Management Platform

CloudServe is a full-stack, enterprise-grade IT Service Management (ITSM) platform designed to streamline incident tracking, automated risk evaluation, and strict ticket lifecycle workflows. Built with a decoupled architecture, it bridges modern high-performance backend logic with an intuitive administrative dashboard.

## 🚀 Key Features

* **Automated Risk & Priority Engine**: Automatically evaluates incoming service requests based on category and risk level, dynamically assigning enterprise priorities (`LOW`, `HIGH`, `CRITICAL`).
* **Strict Ticket Lifecycle Workflows**: Enforces state machine validation rules for incident progression (`OPEN` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`) to ensure complete accountability.
* **Mandatory Resolution Tracking**: Enforces data integrity by requiring validation notes before any incident can be marked as resolved or closed.
* **Modern Administrative Dashboard**: Built with React and Vite following clean Microsoft Fluent UI design principles, offering real-time tracking and state transition actions.

---

## 🛠️ Technology Stack

* **Backend**: Python, FastAPI, SQLite, Pydantic, Uvicorn
* **Frontend**: React, Vite, Axios, JavaScript (ES6+)
* **Architecture**: RESTful API design, Decoupled Client-Server Model

---

## 📂 Project Structure

```text
CloudServe/
│
├── backend/
│   ├── main.py          # FastAPI application, routing, business logic & SQLite integration
│   └── database.db      # Local SQLite instance for persistent storage
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # React dashboard component & API integration handlers
│   │   └── App.css      # Styling rules
│   ├── package.json     # Frontend dependencies (React, Axios, Vite)
│   └── vite.config.js   # Vite build configuration
│
└── README.md
