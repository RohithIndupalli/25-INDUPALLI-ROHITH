# Technical Documentation - Supervity

## 📚 Table of Contents

1. [Technical Stack](#technical-stack)
2. [Architecture Overview](#architecture-overview)
3. [Workflow & Data Flow](#workflow--data-flow)
4. [Data Models](#data-models)
5. [LLM & AI Models](#llm--ai-models)
6. [System Components](#system-components)
7. [API Architecture](#api-architecture)

---

## 🔧 Technical Stack

### Backend Stack

#### **Core Framework**
- **FastAPI 0.128.0**
  - Modern, fast web framework for building APIs
  - Automatic API documentation (OpenAPI/Swagger)
  - Type hints and validation
  - Async/await support
  - Used for: REST API endpoints, request/response handling

#### **AI & Workflow Management**
- **LangGraph 1.0.5**
  - Complex workflow orchestration
  - State machine for multi-step AI processes
  - Used for: Study planning agent workflow
- **LangChain 1.2.0**
  - LLM framework and abstractions
  - Integration layer for OpenAI
  - Used for: LLM interactions, message handling
- **LangChain OpenAI 1.1.6**
  - OpenAI integration for LangChain
  - Chat model interface
  - Used for: GPT model interactions

#### **Database**
- **MongoDB** (via Motor 3.7.1)
  - NoSQL document database
  - Async MongoDB driver
  - Used for: Data persistence, document storage
- **PyMongo 4.15.5**
  - MongoDB Python driver
  - Used for: Database operations

#### **Data Validation & Settings**
- **Pydantic 2.12.5**
  - Data validation using Python type annotations
  - Used for: Request/response models, data validation
- **Pydantic Settings 2.12.0**
  - Settings management
  - Environment variable handling
  - Used for: Configuration management

#### **Other Backend Libraries**
- **Uvicorn 0.40.0**
  - ASGI server
  - Used for: Running FastAPI application
- **APScheduler 3.11.2**
  - Advanced Python Scheduler
  - Used for: Automated reminders, scheduled tasks
- **Python-dotenv 1.2.1**
  - Environment variable management
  - Used for: Loading .env files

### Frontend Stack

#### **Core Framework**
- **React 18.2.0**
  - UI library for building user interfaces
  - Component-based architecture
  - Used for: Frontend application

#### **UI Framework**
- **Material-UI (MUI) 5.15.0**
  - React component library
  - Pre-built, customizable components
  - Used for: UI components (buttons, cards, forms, etc.)

#### **Routing & HTTP**
- **React Router DOM 6.20.1**
  - Client-side routing
  - Used for: Navigation between pages
- **Axios 1.6.2**
  - HTTP client
  - Used for: API calls to backend

#### **Utilities**
- **date-fns 2.30.0**
  - Date formatting and manipulation
  - Used for: Date display and formatting
- **react-calendar 4.7.0**
  - Calendar component
  - Used for: Calendar view of assignments

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Dashboard  │  │   Courses    │  │ Assignments  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Calendar   │  │  AI Agent    │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (FastAPI)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Users   │  │ Courses  │  │Assignments│  │  Agent   │  │
│  │  Routes  │  │  Routes  │  │  Routes   │  │  Routes  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Calendar   │  │    Course    │  │Notification  │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │          LangGraph Agent (Study Planner)          │      │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│      │
│  │  │Analyze │→ │Priority│→ │Suggest │→ │Remind  ││      │
│  │  │ State  │  │ Tasks  │  │Schedule│  │        ││      │
│  │  └────────┘  └────────┘  └────────┘  └────────┘│      │
│  │  ┌────────────────────────────────────────────┐│      │
│  │  │     Task Planner (Prioritization Logic)     ││      │
│  │  └────────────────────────────────────────────┘│      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              MongoDB Database                        │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐│    │
│  │  │  Users  │  │ Courses │  │Assignments│ │Events││    │
│  │  │ Collection│ │Collection│ │Collection│ │Coll. ││    │
│  │  └─────────┘  └─────────┘  └─────────┘  └───────┘│    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   OpenAI API     │  │  (Future) Google │                │
│  │   (GPT Models)   │  │     Calendar API │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Patterns

#### **1. Layered Architecture**
- **Presentation Layer**: React frontend
- **API Layer**: FastAPI REST endpoints
- **Business Logic Layer**: Services and agents
- **Data Access Layer**: MongoDB connections

#### **2. Service-Oriented Architecture (SOA)**
- Services handle specific business domains
- Loose coupling between components
- Easy to test and maintain

#### **3. Agent-Based Architecture**
- LangGraph agent orchestrates complex workflows
- State machine pattern for workflow management
- Asynchronous processing

#### **4. Repository Pattern (Implicit)**
- Database operations abstracted through services
- Models define data structure
- Services handle data access logic

---

## 🔄 Workflow & Data Flow

### Study Planning Agent Workflow (LangGraph)

```
┌──────────────────────────────────────────────────────────┐
│              Study Planning Agent Workflow                │
└──────────────────────────────────────────────────────────┘

1. START
   │
   ├─→ [Analyze State Node]
   │   ├─ Fetch user assignments from MongoDB
   │   ├─ Fetch user courses from MongoDB
   │   ├─ Fetch calendar events
   │   └─ Build initial state
   │
   ├─→ [Prioritize Tasks Node]
   │   ├─ Calculate priority scores
   │   │   ├─ Base priority (1-5)
   │   │   ├─ Urgency factor (days until due)
   │   │   └─ Estimated hours factor
   │   └─ Sort assignments by priority
   │
   ├─→ [Suggest Schedule Node]
   │   ├─ Find free time slots
   │   ├─ Match with assignment requirements
   │   ├─ Consider preferred study hours
   │   └─ Generate study time suggestions
   │
   ├─→ [Send Reminders Node]
   │   ├─ Check upcoming deadlines
   │   ├─ Filter assignments needing reminders
   │   └─ Send notifications (if enabled)
   │
   ├─→ [Generate Recommendations Node]
   │   ├─ Build study plan summary
   │   ├─ If LLM available:
   │   │   ├─ Create context from assignments
   │   │   ├─ Call OpenAI API (GPT-4)
   │   │   └─ Generate AI recommendations
   │   └─ If no LLM:
   │       └─ Use rule-based recommendations
   │
   └─→ END (Return results)
```

### Request Flow

#### **Frontend → Backend Request Flow**

```
User Action (Frontend)
    │
    ├─→ React Component (e.g., Agent.js)
    │   ├─ User clicks "Run Study Planning Agent"
    │   └─ Calls API service function
    │
    ├─→ API Service (api.js)
    │   ├─ Axios HTTP request
    │   └─ POST /api/v1/agent/plan/{user_id}
    │
    ├─→ FastAPI Route (agent.py)
    │   ├─ Validates request
    │   ├─ Calls agent.run(user_id)
    │   └─ Returns JSON response
    │
    ├─→ LangGraph Agent (langgraph_agent.py)
    │   ├─ Executes workflow nodes
    │   ├─ Interacts with services
    │   ├─ Calls OpenAI API (if configured)
    │   └─ Returns structured result
    │
    ├─→ Services Layer
    │   ├─ Calendar Service
    │   ├─ Course Service
    │   ├─ Notification Service
    │   └─ Task Planner
    │
    ├─→ Database (MongoDB)
    │   └─ Data retrieval/storage
    │
    └─→ Response flows back through layers
```

### Data Flow for Assignment Creation

```
User Input (Frontend)
    │
    ├─→ Form Data (Courses.js/Assignments.js)
    │   ├─ User fills form
    │   └─ Validates on frontend
    │
    ├─→ API Call (api.js)
    │   └─ POST /api/v1/assignments
    │
    ├─→ FastAPI Route (assignments.py)
    │   ├─ Pydantic validation (AssignmentCreate)
    │   └─ Calls database operation
    │
    ├─→ Database (MongoDB)
    │   ├─ Inserts document
    │   └─ Returns created document
    │
    ├─→ Response (Assignment model)
    │   ├─ Serializes to JSON
    │   └─ Returns to frontend
    │
    └─→ Frontend Update
        └─ Updates UI with new assignment
```

---

## 📊 Data Models

### User Model

**Location:** `backend/app/models/user.py`

```python
UserBase:
  - email: EmailStr (validated email address)
  - name: str
  - timezone: str (default: "UTC")
  - study_preferences: dict (preferred study times, etc.)

UserCreate (extends UserBase):
  - password: str

UserUpdate:
  - name: Optional[str]
  - timezone: Optional[str]
  - study_preferences: Optional[dict]

User (extends UserBase):
  - id: PyObjectId (MongoDB ObjectId)
  - created_at: datetime
  - updated_at: datetime
```

**Usage:**
- User authentication and profile management
- Stores user preferences for study planning
- Links to courses and assignments

### Course Model

**Location:** `backend/app/models/course.py`

```python
CourseBase:
  - name: str
  - code: str
  - credits: int
  - instructor: Optional[str]
  - schedule: dict (days, times, location)
  - semester: str

CourseCreate (extends CourseBase):
  - user_id: str

CourseUpdate:
  - name: Optional[str]
  - code: Optional[str]
  - credits: Optional[int]
  - instructor: Optional[str]
  - schedule: Optional[dict]
  - semester: Optional[str]

Course (extends CourseBase):
  - id: PyObjectId
  - user_id: str
  - created_at: datetime
  - updated_at: datetime
```

**Usage:**
- Tracks academic courses
- Used for assignment organization
- Schedule information for calendar integration

### Assignment Model

**Location:** `backend/app/models/assignment.py`

```python
AssignmentBase:
  - title: str
  - description: Optional[str]
  - course_id: str
  - due_date: datetime
  - priority: int (1-5 scale, default: 3)
  - estimated_hours: float (default: 2.0)
  - status: str ("pending", "in_progress", "completed")
  - category: Optional[str] (homework, exam, project, etc.)

AssignmentCreate (extends AssignmentBase):
  - user_id: str

AssignmentUpdate:
  - title: Optional[str]
  - description: Optional[str]
  - due_date: Optional[datetime]
  - priority: Optional[int]
  - estimated_hours: Optional[float]
  - status: Optional[str]
  - category: Optional[str]

Assignment (extends AssignmentBase):
  - id: PyObjectId
  - user_id: str
  - created_at: datetime
  - updated_at: datetime
  - suggested_study_times: List[datetime]
  - reminders_sent: List[datetime]
```

**Usage:**
- Core entity for task management
- Priority calculation for agent workflows
- Study time suggestions storage
- Reminder tracking

### Calendar Event Model

**Location:** `backend/app/models/calendar.py`

```python
CalendarEventBase:
  - title: str
  - description: Optional[str]
  - start_time: datetime
  - end_time: datetime
  - event_type: str (class, study, personal, exam, etc.)
  - location: Optional[str]
  - source: str ("manual", "course_sync", "agent_suggestion")

CalendarEventCreate (extends CalendarEventBase):
  - user_id: str

CalendarEventUpdate:
  - title: Optional[str]
  - description: Optional[str]
  - start_time: Optional[datetime]
  - end_time: Optional[datetime]
  - event_type: Optional[str]
  - location: Optional[str]

CalendarEvent (extends CalendarEventBase):
  - id: PyObjectId
  - user_id: str
  - created_at: datetime
  - updated_at: datetime
  - external_id: Optional[str] (for Google Calendar sync)
```

**Usage:**
- Calendar integration
- Free time slot calculation
- Study session scheduling

---

## 🤖 LLM & AI Models

### OpenAI GPT-4

**Model:** `gpt-4` (via LangChain OpenAI)

**Configuration:**
- Temperature: 0.7 (balanced creativity/consistency)
- API: OpenAI API
- Provider: OpenAI

**Usage in Project:**

1. **AI-Powered Recommendations**
   - Location: `backend/app/agents/langgraph_agent.py` → `generate_recommendations()`
   - Purpose: Generate personalized study recommendations
   - Input: Study plan context (urgent assignments, upcoming deadlines, total hours)
   - Output: 3-5 concise recommendations for time management
   - Example Prompt:
     ```
     "User has 3 urgent assignments, 5 upcoming assignments.
      Total hours needed: 15.5
      Based on this context, provide 3-5 concise recommendations:"
     ```

**Integration:**
```python
# Initialization
from langchain_openai import ChatOpenAI
self.llm = ChatOpenAI(
    model="gpt-4",
    temperature=0.7,
    api_key=settings.OPENAI_API_KEY
)

# Usage
messages = [
    SystemMessage(content="You are a helpful study planning assistant."),
    HumanMessage(content=context)
]
response = await self.llm.ainvoke(messages)
recommendations = response.content.split('\n')
```

**Fallback Behavior:**
- If OpenAI API key is not configured, agent uses rule-based recommendations
- Agent still functions for prioritization and scheduling
- Only AI recommendations are disabled

### LangGraph State Machine

**Model:** Custom workflow orchestration

**Usage:**
- Orchestrates multi-step study planning process
- Manages state transitions
- Coordinates between different workflow nodes

**Workflow Nodes:**
1. **analyze_state**: Data gathering
2. **prioritize_tasks**: Rule-based prioritization
3. **suggest_schedule**: Time slot matching
4. **send_reminders**: Notification logic
5. **generate_recommendations**: LLM or rule-based recommendations

---

## 🧩 System Components

### Backend Components

#### **1. API Routes** (`backend/app/api/routes/`)
- **users.py**: User management endpoints
- **courses.py**: Course CRUD operations
- **assignments.py**: Assignment management
- **agent.py**: AI agent endpoints

#### **2. Services** (`backend/app/services/`)
- **calendar_service.py**: Calendar operations, free time calculation
- **course_service.py**: Course business logic
- **notification_service.py**: Reminder and notification logic

#### **3. Agents** (`backend/app/agents/`)
- **langgraph_agent.py**: Main LangGraph workflow agent
- **task_planner.py**: Prioritization and scheduling algorithms

#### **4. Models** (`backend/app/models/`)
- Data models for all entities
- Pydantic validation schemas

#### **5. Database** (`backend/app/database/`)
- **connection.py**: MongoDB connection management

#### **6. Automation** (`backend/automation/`)
- **task_executor.py**: Manual task execution scripts
- **reminder_scheduler.py**: Automated scheduler using APScheduler

### Frontend Components

#### **1. Pages** (`frontend/src/pages/`)
- **Dashboard.js**: Overview and statistics
- **Courses.js**: Course management UI
- **Assignments.js**: Assignment management UI
- **Calendar.js**: Calendar visualization
- **Agent.js**: AI agent interface

#### **2. Components** (`frontend/src/components/`)
- **Navbar.js**: Navigation component

#### **3. Services** (`frontend/src/services/`)
- **api.js**: API client functions for backend communication

---

## 🌐 API Architecture

### REST API Structure

**Base URL:** `http://localhost:8000/api/v1`

#### **Users Endpoints**
```
POST   /users              - Create user
GET    /users/{user_id}    - Get user
PUT    /users/{user_id}    - Update user
```

#### **Courses Endpoints**
```
POST   /courses                    - Create course
GET    /courses/user/{user_id}     - Get user's courses
GET    /courses/{course_id}        - Get course
PUT    /courses/{course_id}        - Update course
DELETE /courses/{course_id}        - Delete course
```

#### **Assignments Endpoints**
```
POST   /assignments                    - Create assignment
GET    /assignments/user/{user_id}     - Get user's assignments
GET    /assignments/{assignment_id}    - Get assignment
PUT    /assignments/{assignment_id}    - Update assignment
DELETE /assignments/{assignment_id}    - Delete assignment
```

#### **Agent Endpoints**
```
POST   /agent/plan/{user_id}    - Run study planning agent
GET    /agent/health            - Check agent health
```

### API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

---

## 🔐 Configuration & Environment

### Environment Variables

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=supervity

# OpenAI
OPENAI_API_KEY=sk-... (optional)

# Google Calendar (future)
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=

# Settings
ENABLE_NOTIFICATIONS=true
```

### Configuration Management

- Uses `pydantic-settings` for configuration
- Environment variables loaded from `.env` file
- Type-safe configuration with validation

---

## 📈 Scalability Considerations

### Current Architecture

- **Single-instance backend**: Suitable for small to medium scale
- **Single MongoDB instance**: Can be scaled to replica set
- **Stateless API**: Easy to scale horizontally
- **Async operations**: Efficient for I/O-bound tasks

### Future Scalability Options

1. **Horizontal Scaling**: Multiple FastAPI instances behind load balancer
2. **Database**: MongoDB replica set or sharding
3. **Caching**: Redis for frequently accessed data
4. **Message Queue**: Celery/RabbitMQ for background tasks
5. **CDN**: For frontend static assets

---

## 🧪 Testing Strategy

### Current State

- Manual testing via Swagger UI
- Frontend testing via browser
- Integration testing via API calls

### Recommended Testing

1. **Unit Tests**: Individual functions and services
2. **Integration Tests**: API endpoints with test database
3. **E2E Tests**: Full workflow testing
4. **Agent Tests**: LangGraph workflow testing

---

## 📝 Summary

### Technology Choices Rationale

1. **FastAPI**: Fast, modern, async-capable, automatic docs
2. **MongoDB**: Flexible schema for academic data
3. **LangGraph**: Complex workflow orchestration
4. **React**: Component-based UI, large ecosystem
5. **Material-UI**: Rapid UI development, professional look
6. **OpenAI GPT-4**: High-quality AI recommendations

### Architecture Benefits

- **Separation of Concerns**: Clear layer boundaries
- **Scalability**: Async operations, stateless design
- **Maintainability**: Modular structure, clear dependencies
- **Extensibility**: Easy to add new features
- **Type Safety**: Pydantic validation, TypeScript support

---

*This documentation provides a comprehensive overview of the Supervity project's technical architecture and implementation details.*

