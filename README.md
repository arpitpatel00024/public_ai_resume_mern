# 🤖 Smart Resume Screener
## 🌐 Live Demo

[Open Smart Resume Screener](https://public-ai-resume-mern.vercel.app/)
An AI-powered resume screening application that compares a candidate's resume with a job description and generates a match score with AI-based feedback.

## 🚀 Features

- 🔐 Google Authentication
- 📄 PDF Resume Upload
- 🖱️ Drag & Drop Resume Upload
- 📝 Job Description Input
- 🤖 AI Resume Analysis using Cohere
- 📊 Resume Match Score
- 💡 AI-generated Feedback
- 🕘 Analysis History
- 🔎 Search & Filter History
- 📋 Detailed Analysis View
- 📱 Responsive UI
- 🗄️ MongoDB Data Storage

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS Modules
- Material UI
- Axios
- Firebase Authentication

### Backend
- Node.js
- Express.js
- Mongoose
- Multer
- PDF Text Extraction

### Database
- MongoDB Atlas

### AI
- Cohere API

### Deployment
- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

---

## 🏗️ Architecture

```text
User
  │
  ▼
React + Vite Frontend
  │
  │ Axios
  ▼
Node.js + Express Backend
  │
  ├── PDF Text Extraction
  │
  ├── Cohere LLM
  │       │
  │       └── Match Score + Feedback
  │
  └── MongoDB Atlas
          │
          └── Analysis History
## 🔄 How It Works

1. User signs in with Google.
2. User uploads a PDF resume.
3. User enters a job description.
4. Backend extracts resume text.
5. Resume and job description are sent to Cohere.
6. Cohere performs semantic matching.
7. Match score and AI feedback are generated.
8. Results are stored in MongoDB.
9. User can view results and analysis history.

---

## 🧠 LLM Usage

Cohere is used to compare the resume with the job description based on skills, experience, projects, education, and technologies.

### Prompt

```text
Compare the following resume with the provided job description.

Evaluate how well the candidate matches the requirements.

Consider skills, experience, projects, education,
and relevant technologies.

Return:

Score: <number from 0 to 100>

Reason:
<clear explanation of the score>

Resume:
{resume_text}

Job Description:
{job_description}

📊 Output
Score: 65%

Feedback:
The candidate has strong Python and SQL skills but lacks
some of the tools required by the job description.

⚙️ Installation
Clone
git clone https://github.com/arpitpatel00024/public_ai_resume_mern.git
cd public_ai_resume_mern
Frontend
npm install
npm run dev
Backend
cd backend_ai
npm install
npm start
🔐 Environment Variables


🔌 API Endpoints
PORT=4000
MONGO_URI=your_mongodb_connection_string
COHERE_API_KEY=your_cohere_api_key

📁 Project Structure
public_ai_resume_mern/
├── backend_ai/
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── conn.js
│   └── index.js
│
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── History/
│   │   ├── Login/
│   │   └── SideBar/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
├── .gitignore
└── README.md