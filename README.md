# NLQ-to-SQL Library Demo

> Natural Language Querying for Library Database  
> Full-stack app using React, Node.js (Express), MySQL, Gemini AI, Aiven, and Vercel

---

## 🌟 Features

- **AI-powered NLQ**: Convert English questions to SQL automatically using Gemini Flash
- **Beautiful React Frontend**: Dark mode, syntax highlighting, responsive Material-UI
- **Express.js Backend**: Secure SQL execution, self-corrects bad queries, validates input
- **MySQL Cloud Database**: Hosted free on Aiven.io with sample library dataset
- **Error Handling**: Frontend and backend show helpful messages for failed queries
- **One-click Deploy**: Vercel for frontend + backend (serverless)

---

## 🗄️ Directory Structure

/
├── backend/ # Node.js/Express server, API, Gemini integration
│ ├── config/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ ├── api/index.js
│ ├── server.js
│ └── vercel.json
├── frontend/ # React Material-UI frontend
│ ├── src/
│ ├── public/
│ └── package.json



---

## 🚀 Deployment (Production)

- **Frontend**: https://nlq-frontend.vercel.app/
- **Backend/API**: https://nlq-2-sql.vercel.app/api
- **Cloud MySQL**: Free tier on [aiven.io](https://aiven.io/)

---

## ⚡ Quickstart (Local)

### Prerequisites

- Node.js (v18+)
- MySQL (or use Aiven credentials)
- Vercel CLI


---

## 🤖 How It Works

- User enters a question (e.g., "Which members have overdue books?")
- Frontend sends NLQ via API to backend
- Backend uses Gemini to turn NLQ into SQL
- Backend runs SQL on the Aiven MySQL DB
- Results returned and shown in a beautiful table

## 📝 Sample Queries

- "Show all overdue books with member details"
- "Which technology books are currently available?"
- "List all students who have borrowed fiction books"
- "How many books has each faculty member borrowed?"

---

## ⚙️ Tech Stack

- React + Material-UI (frontend)
- Node.js (Express) REST API
- Gemini Pro Flash (NLQ-to-SQL)
- MySQL (Aiven)
- Vercel (hosting)

---

## 🙌 Credits

- Gemini/GCP AI for the NLQ-to-SQL core
- Design inspired by Material-UI docs

---

## 📷 Screenshots
<img width="1465" height="801" alt="Screenshot 2025-10-26 at 5 42 52 PM" src="https://github.com/user-attachments/assets/b83530c5-e3fe-48a2-a31a-b51511b944ce" />

<img width="1461" height="786" alt="Screenshot 2025-10-26 at 5 44 58 PM" src="https://github.com/user-attachments/assets/3a39861f-3de8-42ef-823f-19dd1924c4b1" />

<img width="1470" height="795" alt="Screenshot 2025-10-26 at 5 45 52 PM" src="https://github.com/user-attachments/assets/180cfe55-befd-42cd-977c-bad4690a69e8" />

<img width="1470" height="796" alt="Screenshot 2025-10-26 at 5 48 02 PM" src="https://github.com/user-attachments/assets/d05d393a-11cb-4190-8908-204142507f2f" />

---




