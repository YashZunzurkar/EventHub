# EventHub — Modern Event Discovery & Management Platform

A full-stack, enterprise-grade event management SaaS platform built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS. Featuring dark/light mode, live capacity tracking, attendee ticket reservations, and an admin workspace with an access approval workflow.

---

## ✨ Features

- **🎨 Modern SaaS UI:** Designed with a clean, high-contrast aesthetic in both Dark Mode (`#06080F`) and Light Mode (`#FFFFFF`) with persistent theme toggle.
- **🔍 Event Discovery:** Search by keywords, venues, or filter dynamically by categories (*Technology, Music, Workshops, Sports, Business, Art & culture*).
- **🎟️ Instant Ticket Reservations:** Real-time seat tracking, dynamic progress bars, and duplicate-prevention algorithms.
- **💼 Admin Workspace (`/admin`):**
  - Live analytics overview (*Total events, registrations, active users*).
  - Event publishing with custom banner image URLs and live preview.
  - Event management and instant deletion with automated registration cleanup.
  - **Role-Based Access Approval Workflow:** Attendees can request organizer privileges, and master administrators can approve or decline requests.
- **🔐 Secure Authentication:** JWT-based auth, hashed passwords with bcrypt, rate limiting, and password reset via Resend API.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, BcryptJS, Resend API

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_management
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=your_resend_api_key
ADMIN_SECRET_KEY=admin123
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Creating an Admin Account

To promote any registered user to an Admin directly from your terminal:
```bash
cd backend
node makeAdmin.js your_email@example.com
```

---

## 📄 License
MIT License. Built for GDG Web Development.
