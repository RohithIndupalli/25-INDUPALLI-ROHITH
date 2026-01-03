# Complete Run Guide for Supervity

This guide will walk you through setting up and running the Supervity project step-by-step, including all sensitive information you need to configure.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Python 3.9 or higher**
   - Check: `python --version` or `python3 --version`
   - Download: [python.org](https://www.python.org/downloads/)

2. **Node.js 16 or higher**
   - Check: `node --version`
   - Download: [nodejs.org](https://nodejs.org/)

3. **MongoDB**
   - **Option 1 (Local):** Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Option 2 (Cloud - Recommended):** Free tier at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - **Option 3 (Docker):** `docker run -d -p 27017:27017 --name mongodb mongo`

4. **OpenAI API Key (Optional but Recommended)**
   - Get from: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Required for AI-powered study planning features
   - Without it, the agent will work but with limited AI capabilities

---

## 🔐 Step 1: Configure Sensitive Information

### A. Backend Configuration (.env file)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create .env file from example:**
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

3. **Open `.env` file and configure the following:**

   ```env
   # ============================================
   # DATABASE CONFIGURATION (REQUIRED)
   # ============================================
   
   # Option 1: Local MongoDB (if installed locally)
   MONGODB_URL=mongodb://localhost:27017
   
   # Option 2: MongoDB Atlas (Recommended for beginners)
   # Get connection string from: MongoDB Atlas → Connect → Connect your application
   # Format: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   # MONGODB_URL=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   
   # Database name (you can change this)
   DATABASE_NAME=supervity
   
   # ============================================
   # OPENAI API KEY (OPTIONAL BUT RECOMMENDED)
   # ============================================
   # Get from: https://platform.openai.com/api-keys
   # Required for AI-powered recommendations
   OPENAI_API_KEY=sk-your-openai-api-key-here
   
   # ============================================
   # GOOGLE CALENDAR (OPTIONAL - FUTURE FEATURE)
   # ============================================
   # Get from: https://console.cloud.google.com/apis/credentials
   # Not required for basic functionality
   GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id_here
   GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret_here
   
   # ============================================
   # NOTIFICATIONS (OPTIONAL)
   # ============================================
   ENABLE_NOTIFICATIONS=true
   ```

### 🔑 Key Information to Replace:

#### 1. **MongoDB Connection String (REQUIRED)**
   
   **For Local MongoDB:**
   ```env
   MONGODB_URL=mongodb://localhost:27017
   ```
   - Only works if MongoDB is installed and running locally
   
   **For MongoDB Atlas (Free Cloud Database):**
   ```env
   MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   
   **How to get MongoDB Atlas connection string:**
   1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   2. Sign up for free account
   3. Create a free cluster (M0 - Free tier)
   4. Click "Connect" → "Connect your application"
   5. Copy the connection string
   6. Replace `<password>` with your database user password
   7. Replace `<database>` with `supervity` (optional)

#### 2. **OpenAI API Key (OPTIONAL but Recommended)**
   ```env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   **How to get OpenAI API Key:**
   1. Go to [platform.openai.com](https://platform.openai.com/)
   2. Sign up or log in
   3. Go to API Keys section
   4. Click "Create new secret key"
   5. Copy the key (starts with `sk-`)
   6. **⚠️ IMPORTANT:** Save it immediately - you won't see it again!
   
   **Note:** 
   - Without this key, the agent will work but won't generate AI recommendations
   - OpenAI API usage is paid (but very cheap for testing)
   - Free tier available for new accounts

#### 3. **Google Calendar (OPTIONAL - Not Required)**
   - Only needed if you want to sync with Google Calendar
   - Can be left empty for now
   - Instructions available in future updates

---

## 🚀 Step 2: Backend Setup

### 2.1 Install Python Dependencies

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   
   # Linux/Mac
   python3 -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows (PowerShell)
   .\venv\Scripts\Activate.ps1
   
   # Windows (Command Prompt)
   venv\Scripts\activate.bat
   
   # Linux/Mac
   source venv/bin/activate
   ```
   
   **Note:** You should see `(venv)` in your terminal prompt

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   
   This will install:
   - FastAPI
   - LangGraph & LangChain
   - MongoDB driver (Motor)
   - OpenAI SDK
   - And other dependencies

### 2.2 Start MongoDB (if using local)

**Option A: Local MongoDB (Windows)**
```bash
# If installed as service, it starts automatically
# Or start manually:
net start MongoDB
```

**Option B: Local MongoDB (Linux/Mac)**
```bash
sudo systemctl start mongod
# or
mongod
```

**Option C: Docker**
```bash
docker start mongodb
# or if not created:
docker run -d -p 27017:27017 --name mongodb mongo
```

**Option D: MongoDB Atlas (No setup needed)**
- Just use the connection string from Atlas
- No local installation required

### 2.3 Run Backend Server

```bash
# Make sure you're in backend directory with venv activated
python run.py
```

**OR**

```bash
python -m app.main
```

**OR**

```bash
uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
Connected to MongoDB: supervity
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**✅ Success Indicators:**
- Server running on `http://localhost:8000`
- No error messages about MongoDB connection
- You can visit: `http://localhost:8000/health` (should return `{"status": "healthy"}`)
- API docs available at: `http://localhost:8000/docs`

**Keep this terminal window open!**

---

## 💻 Step 3: Frontend Setup

### 3.1 Install Node Dependencies

1. **Open a NEW terminal window** (keep backend running)

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will install:
   - React
   - Material-UI
   - Axios
   - React Router
   - And other dependencies

   **Expected time:** 2-5 minutes (first time)

### 3.2 Configure Frontend (if needed)

The frontend is configured to connect to `http://localhost:8000` by default.

**If your backend runs on a different port**, edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
```

Or create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### 3.3 Run Frontend Server

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view supervity-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**✅ Success Indicators:**
- Browser automatically opens to `http://localhost:3000`
- No compilation errors
- You see the Supervity navigation bar

**Keep this terminal window open!**

---

## ✅ Step 4: Verify Everything Works

### 4.1 Check Backend Health

Open browser and visit:
- Health check: `http://localhost:8000/health`
- Should show: `{"status": "healthy"}`

### 4.2 Check Agent Health

Visit: `http://localhost:8000/api/v1/agent/health`
- Should show agent status and LLM availability

### 4.3 Check API Documentation

Visit: `http://localhost:8000/docs`
- Should show Swagger UI with all API endpoints
- You can test APIs directly from here

### 4.4 Test Frontend

1. Open: `http://localhost:3000`
2. You should see the Dashboard
3. Navigate through different pages:
   - Dashboard
   - Courses
   - Assignments
   - Calendar
   - AI Agent

---

## 🎯 Step 5: Start Using the Application

### Quick Start Workflow:

1. **Create a User** (through API or frontend will auto-create demo user)
2. **Add Courses:**
   - Go to "Courses" page
   - Click "Add Course"
   - Fill in course details
   
3. **Add Assignments:**
   - Go to "Assignments" page
   - Click "Add Assignment"
   - Link to a course, set due date, priority
   
4. **Run AI Agent:**
   - Go to "AI Agent" page
   - Click "Run Study Planning Agent"
   - Wait for analysis and recommendations

5. **View Calendar:**
   - Go to "Calendar" page
   - See assignments visualized on calendar

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error

**Error:** `pymongo.errors.ServerSelectionTimeoutError` or `Connection refused`

**Solutions:**
1. **If using local MongoDB:**
   - Ensure MongoDB is running: `mongod` or check services
   - Check if port 27017 is available
   - Verify connection string: `mongodb://localhost:27017`

2. **If using MongoDB Atlas:**
   - Check connection string format
   - Ensure IP address is whitelisted (Atlas → Network Access → Add IP)
   - Verify username/password are correct
   - Check if cluster is running (not paused)

3. **Test MongoDB connection:**
   ```bash
   # Local MongoDB
   mongosh
   
   # Atlas
   mongosh "your_connection_string"
   ```

### Issue: Port Already in Use

**Error:** `Address already in use` or `EADDRINUSE`

**Solutions:**

**Backend (port 8000):**
```bash
# Windows - Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in run.py or use:
uvicorn app.main:app --reload --port 8001
```

**Frontend (port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port (edit package.json or use):
PORT=3001 npm start
```

### Issue: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'app'`

**Solutions:**
1. Ensure virtual environment is activated (see `(venv)` in prompt)
2. Make sure you're in the `backend` directory
3. Reinstall dependencies: `pip install -r requirements.txt`
4. Check Python path: `python -c "import sys; print(sys.path)"`

### Issue: OpenAI API Errors

**Error:** `Invalid API key` or `Incorrect API key provided`

**Solutions:**
1. Verify API key in `.env` file
2. Check if key starts with `sk-`
3. Ensure no extra spaces in `.env` file
4. Regenerate key from OpenAI dashboard if needed
5. Check API quota/credits in OpenAI dashboard

**Note:** The app works without OpenAI key, just with limited AI features.

### Issue: npm install Fails

**Error:** Various npm errors

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Linux/Mac
rmdir /s node_modules package-lock.json  # Windows

# Reinstall
npm install

# If still fails, try:
npm install --legacy-peer-deps
```

### Issue: CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Check if backend is running
2. Verify frontend URL is in `CORS_ORIGINS` in `backend/app/config.py`
3. Ensure backend CORS middleware is configured correctly

### Issue: Agent Not Working

**Error:** Agent returns errors or no suggestions

**Solutions:**
1. Check agent health: `http://localhost:8000/api/v1/agent/health`
2. Ensure MongoDB has data (assignments, courses)
3. Check backend logs for errors
4. Verify OpenAI API key if using AI features
5. Test with simple data first (one course, one assignment)

---

## 📝 Summary of All Configuration Changes Needed

### ✅ Required Changes:

1. **`backend/.env` file - MongoDB URL**
   - Local: `MONGODB_URL=mongodb://localhost:27017`
   - Atlas: `MONGODB_URL=mongodb+srv://user:pass@cluster...`

2. **`backend/.env` file - OpenAI API Key (Optional)**
   - `OPENAI_API_KEY=sk-your-key-here`

### ⚠️ Optional Changes:

3. **`backend/.env` file - Database Name**
   - Default: `DATABASE_NAME=supervity` (can change)

4. **`frontend/src/services/api.js` - API URL (if backend on different port)**
   - Default: `http://localhost:8000/api/v1`

---

## 🎉 You're Ready!

Once both servers are running:
- **Backend:** `http://localhost:8000`
- **Frontend:** `http://localhost:3000`

Start using Supervity to manage your academic schedule!

---

## 📚 Additional Resources

- **API Documentation:** `http://localhost:8000/docs`
- **Backend Logs:** Check the terminal where backend is running
- **Frontend Logs:** Check browser console (F12)
- **MongoDB Compass:** GUI tool to view database (optional)
  - Download: [mongodb.com/products/compass](https://www.mongodb.com/products/compass)

---

## 🆘 Need Help?

1. Check error messages in terminal/browser console
2. Verify all prerequisites are installed
3. Ensure all configuration is correct
4. Review the troubleshooting section above
5. Check README.md for more details

