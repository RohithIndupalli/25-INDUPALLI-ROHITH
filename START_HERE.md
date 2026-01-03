# 🚀 START HERE - Supervity Setup Guide

Welcome to Supervity! This guide will help you get started quickly.

---

## 📚 Documentation Files

We've created comprehensive guides for you:

1. **📖 RUN_GUIDE.md** - **← START HERE!**
   - Complete step-by-step instructions
   - Detailed setup process
   - Troubleshooting guide
   - Everything you need to know

2. **⚡ QUICK_START.md** - Quick reference checklist
   - Fast setup steps
   - Essential commands only

3. **🔐 CONFIGURATION_SUMMARY.md** - Sensitive information guide
   - All configuration variables explained
   - Where to get API keys
   - Security best practices

4. **📋 README.md** - Project overview
   - Features and architecture
   - Technology stack
   - API documentation

5. **🏗️ PROJECT_STRUCTURE.md** - Code structure
   - Directory organization
   - Component overview

---

## ⚡ Quick Start (3 Steps)

### Step 1: Configure Backend

```bash
cd backend
copy .env.example .env  # Windows
# Edit .env file - Add MongoDB URL (required)
```

**Minimum required in `.env`:**
```env
MONGODB_URL=mongodb://localhost:27017
# OR for Atlas: mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/...
```

### Step 2: Run Backend

```bash
# In backend directory
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python run.py
```

### Step 3: Run Frontend

```bash
# In a NEW terminal
cd frontend
npm install
npm start
```

**That's it!** Open `http://localhost:3000`

---

## 🔑 Critical Configuration

### ✅ REQUIRED: MongoDB Connection

**Get MongoDB URL:**
- **Option 1:** Install locally → `mongodb://localhost:27017`
- **Option 2:** Use MongoDB Atlas (free) → Get connection string from dashboard

### ⚠️ OPTIONAL: OpenAI API Key

**Get from:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

**Required for:** AI-powered study planning recommendations

**Without it:** App works but AI features limited

---

## 📖 Next Steps

1. **Read RUN_GUIDE.md** for detailed instructions
2. **Check CONFIGURATION_SUMMARY.md** for all config options
3. **Follow QUICK_START.md** for fast setup

---

## 🎯 What You'll Need

- ✅ Python 3.9+
- ✅ Node.js 16+
- ✅ MongoDB (local or Atlas)
- ⚠️ OpenAI API Key (optional)

---

## ✅ Verification

After setup, verify:

- Backend: `http://localhost:8000/health` → `{"status": "healthy"}`
- Frontend: `http://localhost:3000` → See dashboard
- API Docs: `http://localhost:8000/docs` → Swagger UI

---

## 🆘 Need Help?

1. Check **RUN_GUIDE.md** troubleshooting section
2. Verify configuration in **CONFIGURATION_SUMMARY.md**
3. Check backend/frontend terminal for error messages
4. Review API documentation at `/docs`

---

## 📝 Files You Need to Edit

**Only ONE file needs editing:**

- `backend/.env` - Add MongoDB URL (and optionally OpenAI key)

Everything else is ready to go!

---

**Ready? Start with RUN_GUIDE.md for complete instructions!** 🚀

