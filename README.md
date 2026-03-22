# Myth.ai 🕉️

> **A divine knowledge platform for exploring ancient mythology and timeless wisdom**

Myth.ai is a full-stack AI-powered web application that lets you converse with a divine scholar about world mythology, browse all 700 verses of the Bhagavad Gita, and explore interactive deity cards — all in one beautiful, immersive experience.

---

## ✨ Features

### 🗣️ AI Chat Interface
- Conversational Q&A powered by **Google Gemini AI**
- Ask questions about mythology from 10+ world traditions: Hindu, Greek, Norse, Egyptian, Celtic, Japanese, Mesopotamian, Native American, African, and Chinese
- Per-user conversation history maintained across the session
- Reverent, scholarly tone — no emojis, rich mythological detail
- Automatic model fallback and rate-limit handling

### 📖 Bhagavad Gita Browser (GitaPath)
- Complete digital library of all **18 chapters** and **700 verses**
- Each verse includes Sanskrit text, transliteration, and English translation
- Audio playback for Sanskrit recitation
- Full-text search across all verses
- **Bookmarking** — save and revisit favorite verses (persisted to database)

### 🃏 Divine Cards (DevaCards)
- Interactive character cards for iconic mythological figures: **Rama, Sita, Krishna, Karna, Draupadi, Abhimanyu**, and more
- Each card details powers, symbolism, iconic stories, and inspiring quotes
- Color-coded by tradition; click any card to open a rich modal with full lore

### 📚 Story Collection (KathaMandal)
- Curated epic tales: *Churning of the Ocean*, *Savitri and Death*, *Prahlada and the Pillar of Faith*, and more
- Each story tagged by tradition and era
- Beautiful narrative presentation with imagery

### 🔖 Bookmarks
- Authenticated users can save Bhagavad Gita verses
- Persistent storage in PostgreSQL via Prisma ORM
- View, manage, and delete bookmarks from a dedicated page

### 🔐 Authentication
- Email / password signup and login via **Supabase**
- Google OAuth integration
- JWT-based session management with automatic token refresh

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Routing** | React Router DOM 7 |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express 4 |
| **ORM** | Prisma 6 |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth (email + Google OAuth) |
| **AI** | Google Generative AI (Gemini) |
| **Web Scraping** | Cheerio (fallback for Gita verses) |
| **Deployment** | Render (backend), Vercel (frontend) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A [Supabase](https://supabase.com) project (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

### 1. Clone the repository

```bash
git clone https://github.com/Arohi-jd/Myth.ai.git
cd Myth.ai
```

### 2. Configure environment variables

#### Backend — create `backend/.env`

```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-anon-key>

# PostgreSQL (Supabase connection string)
DATABASE_URL=postgresql://postgres:<password>@db.<your-project-ref>.supabase.co:5432/postgres?schema=public

# Google Gemini
GEMINI_API_KEY=<your-gemini-api-key>

# CORS — URL where your frontend runs
FRONTEND_URL=http://localhost:3000
```

#### Frontend — create `frontend/.env`

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Set up the database

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations (creates bookmarks table)
npm run prisma:migrate

# Seed all 700 Bhagavad Gita verses
npm run seed:gita
```

> 📝 You also need to create the `gita_chapters` and `gita_verses` tables in Supabase. Log in to the Supabase dashboard → **SQL Editor** and run the table creation and seeding scripts provided in the project's SQL files.

> 📝 If Supabase email confirmation is enabled, see [SETUP_SUPABASE.md](./SETUP_SUPABASE.md) to disable it for local development.

### 5. Start the development servers

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend && npm run dev
```

Open your browser at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
Myth.ai/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema (User, Bookmark)
│   └── src/
│       ├── controllers/
│       │   ├── authController.js  # Signup, login, Google OAuth, token refresh
│       │   ├── chatController.js  # Gemini AI chat with conversation history
│       │   ├── gitaController.js  # Gita chapter & verse retrieval
│       │   └── bookmarkController.js  # Bookmark CRUD
│       ├── data/
│       │   └── gitaVerses.js      # All 700 verses (local fallback dataset)
│       ├── lib/
│       │   ├── gemini.js          # Google Generative AI client
│       │   ├── supabase.js        # Supabase client
│       │   ├── prisma.js          # Prisma client
│       │   └── gitaScraper.js     # Web scraper fallback for verses
│       ├── middleware/
│       │   └── authMiddleware.js  # JWT verification via Supabase
│       ├── routes/
│       │   ├── auth.js
│       │   ├── chat.js
│       │   ├── gita.js
│       │   └── bookmarks.js
│       └── index.js               # Express app entry point
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.tsx         # Top navigation bar
│       │   ├── ChakraLoader.tsx   # Animated loading spinner
│       │   └── Particles.tsx      # Background particle effects
│       ├── pages/
│       │   ├── ChatPage.tsx       # AI mythology chat
│       │   ├── GitaPath.tsx       # Bhagavad Gita browser
│       │   ├── DevaCards.tsx      # Divine deity cards
│       │   ├── KathaMandal.tsx    # Epic story collection
│       │   └── Bookmarks.tsx      # Saved verse bookmarks
│       ├── utils/
│       │   └── authFetch.ts       # Authenticated fetch wrapper
│       ├── lib/
│       │   └── supabase.ts        # Supabase JS client
│       ├── data/
│       │   └── gitaData.ts        # Chapter metadata
│       └── App.tsx                # Root component & router
│
├── GITA_SETUP.md                  # Supabase table creation & verse seeding guide
├── SETUP_SUPABASE.md              # Supabase email confirmation setup guide
└── README.md
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register with email & password |
| POST | `/api/auth/login` | Login with email & password |
| POST | `/api/auth/refresh` | Refresh JWT access token |
| POST | `/api/auth/google/callback` | Handle Google OAuth callback |
| GET  | `/api/auth/me` | Get authenticated user profile |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send a message; returns AI response |
| DELETE | `/api/chat/history` | Clear current user's conversation history |

**Chat request body:**
```json
{ "message": "Who is Lord Shiva?" }
```

### Bhagavad Gita

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gita/chapters` | List all 18 chapters |
| GET | `/api/gita/chapters/:chapter/verses` | Get all verses in a chapter |
| GET | `/api/gita/chapters/:chapter/verses/:verse` | Get a specific verse |
| GET | `/api/gita/search?q=<term>` | Full-text verse search |

### Bookmarks *(requires authentication)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks` | Get the authenticated user's bookmarks |
| POST | `/api/bookmarks` | Save a verse as a bookmark |
| DELETE | `/api/bookmarks/:verseNumber` | Remove a bookmark |

---

## ☁️ Deployment

### Backend — Render.com

1. Create a new **Web Service** in Render and connect this repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install && npm run build`.
4. Set **Start Command** to `npm run start`.
5. Add the following environment variables in the Render dashboard:

| Variable | Value |
|----------|-------|
| `PORT` | `10000` |
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | Your Supabase URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `DATABASE_URL` | Your Supabase PostgreSQL URL |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `FRONTEND_URL` | Your deployed frontend URL |

### Frontend — Vercel

1. Import the repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variables:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_API_URL` | Your Render backend URL + `/api` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is open-source. See the repository for license details.

---

<div align="center">
  <p>Built with ❤️ and devotion to ancient wisdom</p>
  <p><strong>Myth.ai</strong> — Where mythology meets modern AI</p>
</div>