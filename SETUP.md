# Setup Guide for Supervity

This guide will help you set up and run the Supervity application.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Python 3.9 or higher**
   ```bash
   python --version
   ```

2. **Node.js 16 or higher**
   ```bash
   node --version
   ```

3. **MongoDB**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud): [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Or use Docker: `docker run -d -p 27017:27017 mongo`

4. **OpenAI API Key (Optional)**
   - Get one from [platform.openai.com](https://platform.openai.com/api-keys)
   - Required for AI-powered recommendations

## Quick Start

### Step 1: Clone or Navigate to Project

```bash
cd Supervity
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Linux/Mac:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create .env file:**
   ```bash
   # Copy the example file
   copy .env.example .env  # Windows
   # or
   cp .env.example .env    # Linux/Mac
   ```

6. **Edit .env file:**
   Open `.env` and update the following:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=supervity
   OPENAI_API_KEY=your_openai_api_key_here
   ```

7. **Start MongoDB (if running locally):**
   - **Windows:** Start MongoDB service or run `mongod`
   - **Linux/Mac:** `sudo systemctl start mongod` or `mongod`
   - **Docker:** Already running if using Docker

8. **Run the backend server:**
   ```bash
   python run.py
   # or
   python -m app.main
   # or
   uvicorn app.main:app --reload --port 8000
   ```

   The API will be available at: `http://localhost:8000`
   API Docs (Swagger): `http://localhost:8000/docs`

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will open at: `http://localhost:3000`

## Running Automation Scripts

### Manual Task Execution

```bash
# From backend directory
cd backend
python -m automation.task_executor deadlines    # Check deadlines
python -m automation.task_executor planning     # Run daily planning
```

### Automated Scheduler (Optional)

Run the scheduler for continuous automation:

```bash
cd backend
python -m automation.reminder_scheduler
```

This will:
- Check deadlines every hour
- Run daily planning at 8:00 AM
- Send reminders for upcoming assignments

## Verification

1. **Backend Health Check:**
   - Visit: `http://localhost:8000/health`
   - Should return: `{"status": "healthy"}`

2. **Agent Health Check:**
   - Visit: `http://localhost:8000/api/v1/agent/health`
   - Should return agent status

3. **Frontend:**
   - Open: `http://localhost:3000`
   - You should see the Supervity dashboard

## Common Issues

### MongoDB Connection Error

**Error:** `pymongo.errors.ServerSelectionTimeoutError`

**Solution:**
- Ensure MongoDB is running
- Check MongoDB URL in `.env` file
- For MongoDB Atlas, use the connection string from Atlas dashboard

### Port Already in Use

**Error:** `Address already in use`

**Solution:**
- Change port in `run.py` or use: `uvicorn app.main:app --reload --port 8001`
- Kill the process using the port:
  - Windows: `netstat -ano | findstr :8000` then `taskkill /PID <PID> /F`
  - Linux/Mac: `lsof -ti:8000 | xargs kill`

### Module Not Found Errors

**Error:** `ModuleNotFoundError: No module named 'app'`

**Solution:**
- Ensure you're in the `backend` directory
- Activate virtual environment
- Install dependencies: `pip install -r requirements.txt`

### OpenAI API Errors

**Error:** API key related errors

**Solution:**
- The application works without OpenAI API key (with limited AI features)
- For full AI features, add a valid OpenAI API key to `.env`
- Get API key from: https://platform.openai.com/api-keys

### Frontend Build Errors

**Error:** npm install fails

**Solution:**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run: `npm install` again

## Next Steps

1. **Create a user** (through the API or frontend)
2. **Add courses** via the Courses page
3. **Add assignments** via the Assignments page
4. **Run the AI agent** to get study planning suggestions
5. **Set up automation** for reminders and daily planning

## Development Tips

- **Backend auto-reload:** The `--reload` flag enables auto-reload on code changes
- **Frontend hot-reload:** React dev server automatically reloads on changes
- **API Testing:** Use Swagger UI at `/docs` for testing API endpoints
- **Database GUI:** Consider using MongoDB Compass for database visualization

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in environment
2. Use a production WSGI server (e.g., Gunicorn)
3. Set up proper CORS origins
4. Use environment variables for all secrets
5. Enable HTTPS
6. Set up proper authentication/authorization
7. Use a production database (MongoDB Atlas recommended)

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review API documentation at `/docs`
3. Check logs for error messages
4. Verify all prerequisites are installed

