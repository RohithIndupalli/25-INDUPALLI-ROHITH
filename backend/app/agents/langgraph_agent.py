"""LangGraph agent for workflow management."""
from typing import TypedDict, Annotated, List, Dict, Any
from datetime import datetime, timedelta
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_community.llms import HuggingFaceEndpoint
from app.database.connection import get_database
from app.models.assignment import Assignment
from app.models.course import Course
from app.services.calendar_service import CalendarService
from app.services.notification_service import NotificationService
from app.agents.task_planner import TaskPlanner
from app.config import settings

class AgentState(TypedDict):
    """State for the LangGraph agent."""
    user_id: str
    messages: Annotated[List[Any], "messages"]
    assignments: List[Dict]
    courses: List[Dict]
    calendar_events: List[Dict]
    suggestions: List[Dict]
    current_task: str

class StudyPlannerAgent:
    """LangGraph agent for study planning and task management."""
    
    def __init__(self):
        """Initialize the agent."""
        if settings.HUGGINGFACE_API_KEY:
            self.llm = HuggingFaceEndpoint(
                repo_id=settings.HUGGINGFACE_MODEL,
                temperature=0.7,
                huggingfacehub_api_token=settings.HUGGINGFACE_API_KEY,
                max_length=512
            )
        else:
            self.llm = None  # Will use fallback logic
        
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """Build the LangGraph workflow."""
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("analyze_state", self.analyze_state)
        workflow.add_node("prioritize_tasks", self.prioritize_tasks)
        workflow.add_node("suggest_schedule", self.suggest_schedule)
        workflow.add_node("send_reminders", self.send_reminders)
        workflow.add_node("generate_recommendations", self.generate_recommendations)
        
        # Define edges
        workflow.set_entry_point("analyze_state")
        workflow.add_edge("analyze_state", "prioritize_tasks")
        workflow.add_edge("prioritize_tasks", "suggest_schedule")
        workflow.add_edge("suggest_schedule", "send_reminders")
        workflow.add_edge("send_reminders", "generate_recommendations")
        workflow.add_edge("generate_recommendations", END)
        
        return workflow.compile()
    
    async def analyze_state(self, state: AgentState) -> AgentState:
        """Analyze current state of assignments and calendar."""
        db = get_database()
        user_id = state["user_id"]
        
        # Fetch assignments
        assignments_cursor = db.assignments.find({
            "user_id": user_id,
            "status": {"$ne": "completed"}
        })
        assignments = await assignments_cursor.to_list(length=100)
        # Keep _id as ObjectId for proper Pydantic validation
        state["assignments"] = [dict(a) for a in assignments]
        
        # Fetch courses
        courses_cursor = db.courses.find({"user_id": user_id})
        courses = await courses_cursor.to_list(length=100)
        # Keep _id as ObjectId for proper Pydantic validation
        state["courses"] = [dict(c) for c in courses]
        
        # Fetch upcoming calendar events
        end_date = datetime.utcnow() + timedelta(days=30)
        events = await CalendarService.get_user_events(user_id, datetime.utcnow(), end_date)
        state["calendar_events"] = [e.model_dump(mode="json") for e in events]
        
        return state
    
    async def prioritize_tasks(self, state: AgentState) -> AgentState:
        """Prioritize assignments using TaskPlanner."""
        assignments = [Assignment(**a) for a in state["assignments"]]
        prioritized = await TaskPlanner.prioritize_assignments(state["user_id"], assignments)
        
        state["assignments"] = [a.model_dump(mode="json") for a in prioritized]
        state["current_task"] = "prioritization_complete"
        
        return state
    
    async def suggest_schedule(self, state: AgentState) -> AgentState:
        """Suggest study times for assignments."""
        suggestions = []
        # Convert dict to Assignment models (handle ObjectId properly)
        assignments = []
        for a in state["assignments"][:5]:  # Top 5
            try:
                assignments.append(Assignment(**a))
            except Exception as e:
                print(f"Warning: Skipping invalid assignment in schedule suggestions: {e}")
                continue
        
        for assignment in assignments:
            study_times = await TaskPlanner.suggest_study_times(state["user_id"], assignment)
            suggestions.append({
                "assignment_id": str(assignment.id),
                "title": assignment.title,
                "suggested_times": [st.isoformat() for st in study_times],
                "estimated_hours": assignment.estimated_hours
            })
        
        state["suggestions"] = suggestions
        state["current_task"] = "schedule_suggestions_generated"
        
        return state
    
    async def send_reminders(self, state: AgentState) -> AgentState:
        """Send reminders for upcoming deadlines."""
        reminders = await NotificationService.check_and_send_upcoming_deadlines(
            state["user_id"], hours_ahead=24
        )
        state["current_task"] = f"reminders_sent: {len(reminders)}"
        
        return state
    
    async def generate_recommendations(self, state: AgentState) -> AgentState:
        """Generate final recommendations."""
        # Convert dict to Assignment models
        assignments = []
        for a in state["assignments"]:
            try:
                assignments.append(Assignment(**a))
            except Exception as e:
                print(f"Warning: Skipping invalid assignment in recommendations: {e}")
                continue
        
        study_plan = TaskPlanner.generate_study_plan(state["user_id"], assignments)
        
        # Generate AI recommendations if LLM is available
        if self.llm:
            try:
                context = f"""
                User has {study_plan['urgent_count']} urgent assignments, 
                {study_plan['upcoming_count']} upcoming assignments.
                Total hours needed: {study_plan['total_hours_needed']}
                """
                
                # Format prompt for text generation model
                prompt = f"""You are a helpful study planning assistant. Based on this context, provide 3-5 concise recommendations:

{context}

Recommendations:"""
                
                response = await self.llm.ainvoke(prompt)
                recommendations = [r.strip() for r in response.split('\n') if r.strip() and not r.strip().startswith('Recommendations:')]
            except Exception as e:
                print(f"Error generating AI recommendations: {e}")
                recommendations = study_plan.get("recommendations", [])
        else:
            recommendations = study_plan.get("recommendations", [])
        
        state["suggestions"].append({
            "type": "recommendations",
            "content": recommendations
        })
        state["current_task"] = "complete"
        
        return state
    
    async def run(self, user_id: str) -> Dict[str, Any]:
        """Run the agent workflow."""
        initial_state: AgentState = {
            "user_id": user_id,
            "messages": [],
            "assignments": [],
            "courses": [],
            "calendar_events": [],
            "suggestions": [],
            "current_task": "initialized"
        }
        
        final_state = await self.graph.ainvoke(initial_state)
        
        return {
            "user_id": user_id,
            "assignments": final_state["assignments"],
            "suggestions": final_state["suggestions"],
            "study_plan": TaskPlanner.generate_study_plan(
                user_id, 
                [Assignment(**a) for a in final_state["assignments"]]
            )
        }

# Global agent instance
agent = StudyPlannerAgent()

