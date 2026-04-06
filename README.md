# Nexus Studio — High-Fidelity Creative Showroom

Nexus Studio is a motion-first, high-fidelity creative engineering marketplace. It serves as a laboratory for developers to showcase their most advanced research, from generative AI artwork to low-latency robotics telemetry.

---

## 🎨 Branding & Aesthetic
The platform features a **"Technical Lab"** dark-mode theme with:
- **Glassmorphism**: Semi-transparent, layered UI components.
- **Floating Shaders**: A high-performance background based on ReactBits "Floating Lines".
- **Sour Sloth Icons**: Custom, bouncy social animations.
- **Devfolio Footer**: A professional, structured navigation experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js + Vite
- **Styling**: Tailwind CSS + Custom Vanilla CSS
- **Motion**: Framer Motion
- **Icons**: Lucide React + custom animation wrappers

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT-based with flexible Email/Username login
- **Security**: PBKDF2-SHA256 password hashing

---

## 🚀 Key Features

- **Flexible Authentication**: Log in with either your **email** or your **username**.
- **Project Showroom**: A public, searchable feed of "Active" projects with real-time filtering by title or tech stack.
- **Technical Lab (Studio)**: A dedicated workspace for creators to manage drafts, view analytics, and publish research.
- **User Profiles**: Interactive profile management with an "Edit Details" suite.
- **Privacy Controls**: Automatic visibility logic — public Projects page only shows "Active" research.

---

## 🏗️ Installation

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Setup Backend
1. `cd backend`
2. `python -m venv venv`
3. Activate environment:
   - Windows: `.\venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. `pip install -r requirements.txt`
5. `python -m uvicorn main:app --reload`

### Setup Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 🧪 Initial Mock Users
- **Main User**: `testuser` / `password: test` (Email: `test@gmail.com`)
- **Second User**: `testuser2` / `password: test` (Email: `test2@gmail.com`)

---

Developed with ❤️ for the Creative Engineering community.
