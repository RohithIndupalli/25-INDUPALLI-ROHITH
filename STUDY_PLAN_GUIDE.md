# How to Generate a Study Plan - Step by Step Guide

## ✅ Issue Fixed!

The error you were experiencing has been fixed. The problem was with ObjectId conversion in the agent workflow. The code has been updated to properly handle MongoDB ObjectIds.

## 🎯 Steps to Generate a Study Plan

### Step 1: Ensure Backend is Running

Make sure your backend server is running:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python run.py
```

The backend should be running on `http://localhost:8000`

### Step 2: Add Data (Optional but Recommended)

For a meaningful study plan, add some data:

#### A. Add Courses
1. Go to the **Courses** page in the frontend
2. Click **"Add Course"**
3. Fill in:
   - Course Name (e.g., "Introduction to Computer Science")
   - Course Code (e.g., "CS101")
   - Credits (e.g., 3)
   - Instructor (optional)
   - Semester (e.g., "Fall 2024")
4. Click **"Add"**

#### B. Add Assignments
1. Go to the **Assignments** page
2. Click **"Add Assignment"**
3. Fill in:
   - Title (e.g., "Midterm Exam")
   - Description (optional)
   - Course (select from dropdown)
   - Due Date & Time
   - Priority (1-5, where 5 is most urgent)
   - Estimated Hours
   - Status (pending, in_progress, completed)
   - Category (homework, exam, project, etc.)
4. Click **"Add"**

**Tip:** Add multiple assignments with different priorities and due dates for a more comprehensive study plan.

### Step 3: Generate Study Plan

1. Go to the **AI Agent** page
2. You should see:
   - Agent Status (should show "healthy")
   - LLM Available status
3. Click **"Run Study Planning Agent"** button
4. Wait for the agent to process (this may take a few seconds)
5. You should see:
   - **Study Plan Summary** with statistics
   - **Suggestions & Recommendations** 
   - **Prioritized Assignments** list

## 📊 What the Study Plan Includes

The study plan will show:

1. **Study Plan Summary**
   - Urgent assignments count (due in ≤3 days)
   - Upcoming assignments count (due in 4-7 days)
   - Future assignments count (due in >7 days)
   - Total hours needed

2. **Suggestions & Recommendations**
   - **Study Time Suggestions**: Optimal times to study for each assignment
   - **AI Recommendations**: Personalized tips (if OpenAI API key is configured)
   - **Rule-based Recommendations**: Basic tips (if no API key)

3. **Prioritized Assignments**
   - List of assignments sorted by priority
   - Each assignment shows:
     - Title
     - Due date
     - Priority level
     - Estimated hours
     - Status

## 🔧 Troubleshooting

### If the Agent Still Fails

1. **Check Backend Logs**
   - Look at the terminal where `python run.py` is running
   - Look for error messages

2. **Check Agent Health**
   - Visit: `http://localhost:8000/api/v1/agent/health`
   - Should show: `{"status": "healthy", ...}`

3. **Verify Data Exists**
   - Make sure you have at least one assignment
   - The agent works even with no data, but results will be empty

4. **Restart Backend**
   - Stop the backend (Ctrl+C)
   - Restart: `python run.py`

### Common Issues

**"No assignments found"**
- Add at least one assignment in the Assignments page
- Make sure assignments are not all marked as "completed"

**"Backend not reachable"**
- Make sure backend is running on port 8000
- Check if there are any error messages in backend terminal

**"Agent health check fails"**
- Check backend logs for errors
- Make sure MongoDB is running and connected

## 💡 Tips for Best Results

1. **Add Multiple Assignments**: The more assignments you have, the better the prioritization
2. **Set Realistic Priorities**: Use priority 5 for urgent items, 1 for less urgent
3. **Set Accurate Estimates**: Estimated hours help the agent suggest study times
4. **Add Due Dates**: Critical for prioritization and scheduling
5. **Use Categories**: Helps organize assignments (homework, exam, project, etc.)

## 🎉 Success!

Once the agent runs successfully, you'll see:
- A comprehensive study plan
- Prioritized list of assignments
- Suggested study times
- Personalized recommendations

The study plan is generated using:
- **Task Prioritization Algorithm**: Calculates priority scores based on due dates, importance, and workload
- **Free Time Analysis**: Finds optimal study slots in your schedule
- **AI Recommendations**: GPT-4 powered suggestions (if API key configured)
- **Rule-based Logic**: Fallback recommendations (always works)

Enjoy your personalized study plan! 📚✨

