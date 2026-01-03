# Quick Start Checklist

Use this as a quick reference while setting up the project.

## 🔑 Critical Configuration (Must Do)

### 1. Backend .env File

**Location:** `backend/.env`

**Create from template:**
```bash
cd backend
copy .env.example .env  # Windows
# or
cp .env.example .env    # Linux/Mac
```

**Minimum Required Configuration:**
```env
# REQUIRED: MongoDB Connection
MONGODB_URL=mongodb://localhost:27017
# OR for Atlas: mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# OPTIONAL: OpenAI API Key (for AI features)
OPENAI_API_KEY=sk-your-key-here
```

---

## ⚡ Quick Setup Steps

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
# Edit .env file with your MongoDB URL
python run.py
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

---

## 🔐 Where to Get Keys/Secrets

| What | Where to Get | Required? |
|------|-------------|-----------|
| **MongoDB URL** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free) or install locally | ✅ YES |
| **OpenAI API Key** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | ❌ Optional |

---

## ✅ Verification Checklist

- [ ] MongoDB is running (local) or Atlas cluster is active
- [ ] Backend server running on `http://localhost:8000`
- [ ] Frontend server running on `http://localhost:3000`
- [ ] Can access `http://localhost:8000/health` → `{"status": "healthy"}`
- [ ] Can access `http://localhost:3000` → See Supervity dashboard

---

## 📝 Files to Edit

1. **`backend/.env`** - Add MongoDB URL and OpenAI key
2. **No other files need editing for basic setup**

---

For detailed instructions, see **RUN_GUIDE.md**

