# Technical Stack Summary - Quick Reference

## 🚀 Core Technologies

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.128.0 | REST API framework |
| **Python** | 3.9+ | Programming language |
| **MongoDB** | - | NoSQL database |
| **Motor** | 3.7.1 | Async MongoDB driver |
| **LangGraph** | 1.0.5 | Workflow orchestration |
| **LangChain** | 1.2.0 | LLM framework |
| **OpenAI** | 2.14.0 | GPT-4 API client |
| **Pydantic** | 2.12.5 | Data validation |
| **Uvicorn** | 0.40.0 | ASGI server |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **Material-UI** | 5.15.0 | Component library |
| **React Router** | 6.20.1 | Client-side routing |
| **Axios** | 1.6.2 | HTTP client |
| **Node.js** | 16+ | Runtime |

## 🤖 AI/LLM Models Used

### Primary LLM
- **OpenAI GPT-4**
  - **Model**: `gpt-4`
  - **Temperature**: 0.7
  - **Usage**: Study planning recommendations
  - **Integration**: Via LangChain OpenAI
  - **Required**: OpenAI API key (optional - agent works without it)

### Workflow Engine
- **LangGraph State Machine**
  - Custom workflow orchestration
  - 5-node workflow for study planning
  - State management for multi-step processes

## 📊 Data Models

1. **User** - User profiles and preferences
2. **Course** - Academic courses
3. **Assignment** - Tasks and assignments
4. **CalendarEvent** - Calendar entries

## 🏗️ Architecture Pattern

**Layered Architecture:**
- Presentation Layer (React)
- API Layer (FastAPI)
- Business Logic Layer (Services + Agents)
- Data Layer (MongoDB)

**Design Patterns:**
- Service-Oriented Architecture (SOA)
- Agent-Based Architecture (LangGraph)
- Repository Pattern (implicit)

## 🔄 Workflow

1. Analyze State → 2. Prioritize Tasks → 3. Suggest Schedule → 4. Send Reminders → 5. Generate Recommendations

## 📝 Key Files

- **Main App**: `backend/app/main.py`
- **Agent**: `backend/app/agents/langgraph_agent.py`
- **Models**: `backend/app/models/`
- **API Routes**: `backend/app/api/routes/`
- **Frontend**: `frontend/src/pages/`

For detailed information, see **TECHNICAL_DOCUMENTATION.md**

