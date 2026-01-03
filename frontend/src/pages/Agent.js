import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { runStudyPlanning, getAgentHealth } from '../services/api';
import { format } from 'date-fns';

function AgentPage({ userId }) {
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);

  React.useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const healthData = await getAgentHealth();
      setHealth(healthData);
    } catch (err) {
      console.error('Failed to check agent health:', err);
    }
  };

  const handleRunAgent = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await runStudyPlanning(userId);
      setPlanResult(result);
    } catch (err) {
      let errorMessage = 'Failed to run AI agent. ';
      if (err.response) {
        errorMessage += err.response.data?.detail || err.response.data?.message || 'Backend error occurred.';
      } else if (err.request) {
        errorMessage += 'Backend is not reachable. Make sure the backend server is running on http://localhost:8000';
      } else {
        errorMessage += 'An unexpected error occurred.';
      }
      setError(errorMessage);
      console.error('Agent error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="content-container">
      <Typography variant="h4" className="page-title">
        AI Study Planning Agent
      </Typography>

      {health && (
        <Alert
          severity={health.status === 'healthy' ? 'success' : 'warning'}
          sx={{ mb: 2 }}
        >
          Agent Status: {health.status} | LLM Available: {health.llm_available ? 'Yes' : 'No'}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <SmartToyIcon fontSize="large" color="primary" />
            <Box>
              <Typography variant="h6">LangGraph Study Planner Agent</Typography>
              <Typography variant="body2" color="text.secondary">
                This agent analyzes your assignments, prioritizes tasks, suggests optimal study
                times, and generates personalized recommendations using AI.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleRunAgent}
            disabled={loading}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Run Study Planning Agent'
            )}
          </Button>
        </CardContent>
      </Card>

      {planResult && (
        <>
          {planResult.study_plan && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Study Plan Summary
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
                  <Chip
                    label={`Urgent: ${planResult.study_plan.urgent_count}`}
                    color="error"
                  />
                  <Chip
                    label={`Upcoming: ${planResult.study_plan.upcoming_count}`}
                    color="warning"
                  />
                  <Chip
                    label={`Future: ${planResult.study_plan.future_count}`}
                    color="info"
                  />
                  <Chip
                    label={`Total Hours: ${planResult.study_plan.total_hours_needed?.toFixed(1)}h`}
                    color="primary"
                  />
                </Box>
              </CardContent>
            </Card>
          )}

          {planResult.suggestions && planResult.suggestions.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Suggestions & Recommendations
                </Typography>
                <List>
                  {planResult.suggestions.map((suggestion, idx) => (
                    <React.Fragment key={idx}>
                      {suggestion.type === 'recommendations' ? (
                        <>
                          <ListItem>
                            <ListItemText
                              primary="AI Recommendations"
                              secondary={
                                <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                                  {suggestion.content.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                  ))}
                                </Box>
                              }
                            />
                          </ListItem>
                          {idx < planResult.suggestions.length - 1 && <Divider />}
                        </>
                      ) : (
                        <>
                          <ListItem>
                            <ListItemText
                              primary={suggestion.title}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Estimated Hours: {suggestion.estimated_hours}h
                                  </Typography>
                                  {suggestion.suggested_times &&
                                    suggestion.suggested_times.length > 0 && (
                                      <Box mt={1}>
                                        <Typography variant="body2" fontWeight="bold">
                                          Suggested Study Times:
                                        </Typography>
                                        {suggestion.suggested_times.map((time, i) => (
                                          <Typography
                                            key={i}
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            • {format(new Date(time), 'PPP p')}
                                          </Typography>
                                        ))}
                                      </Box>
                                    )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {idx < planResult.suggestions.length - 1 && <Divider />}
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {planResult.assignments && planResult.assignments.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Prioritized Assignments
                </Typography>
                <List>
                  {planResult.assignments.slice(0, 10).map((assignment, idx) => (
                    <React.Fragment key={assignment._id || idx}>
                      <ListItem>
                        <ListItemText
                          primary={assignment.title}
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                Due: {format(new Date(assignment.due_date), 'PPP p')} | 
                                Priority: {assignment.priority}/5 | 
                                Estimated: {assignment.estimated_hours}h
                              </Typography>
                              <Chip
                                label={assignment.status}
                                size="small"
                                color={
                                  assignment.status === 'completed'
                                    ? 'success'
                                    : assignment.status === 'in_progress'
                                    ? 'info'
                                    : 'default'
                                }
                                sx={{ mt: 0.5 }}
                              />
                            </>
                          }
                        />
                      </ListItem>
                      {idx < Math.min(planResult.assignments.length - 1, 9) && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}

export default AgentPage;

