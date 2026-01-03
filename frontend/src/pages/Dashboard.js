import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getUserAssignments, runStudyPlanning } from '../services/api';
import { format } from 'date-fns';

function Dashboard({ userId }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAssignments();
  }, [userId]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await getUserAssignments(userId);
      setAssignments(data);
    } catch (err) {
      setError('Failed to load assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPlanning = async () => {
    try {
      setPlanLoading(true);
      setError(null);
      const result = await runStudyPlanning(userId);
      setStudyPlan(result);
      await loadAssignments(); // Refresh assignments
    } catch (err) {
      setError('Failed to run study planning');
      console.error(err);
    } finally {
      setPlanLoading(false);
    }
  };

  const pendingAssignments = assignments.filter(a => a.status !== 'completed');
  const overdueAssignments = pendingAssignments.filter(
    a => new Date(a.due_date) < new Date()
  );
  const urgentAssignments = pendingAssignments.filter(
    a => {
      const daysUntilDue = (new Date(a.due_date) - new Date()) / (1000 * 60 * 60 * 24);
      return daysUntilDue <= 3 && daysUntilDue >= 0;
    }
  );

  if (loading) {
    return (
      <Container className="content-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container className="content-container">
      <Typography variant="h4" className="page-title">
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Assignments
              </Typography>
              <Typography variant="h3">{pendingAssignments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Overdue
              </Typography>
              <Typography variant="h3" color="error">
                {overdueAssignments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="warning.main">
                Urgent (≤3 days)
              </Typography>
              <Typography variant="h3" color="warning.main">
                {urgentAssignments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">AI Study Planning</Typography>
                <Button
                  variant="contained"
                  onClick={handleRunPlanning}
                  disabled={planLoading}
                >
                  {planLoading ? <CircularProgress size={24} /> : 'Generate Plan'}
                </Button>
              </Box>

              {studyPlan && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Study Plan Summary
                  </Typography>
                  {studyPlan.study_plan && (
                    <Box mt={2}>
                      <Typography>
                        Urgent: {studyPlan.study_plan.urgent_count} | 
                        Upcoming: {studyPlan.study_plan.upcoming_count} | 
                        Total Hours Needed: {studyPlan.study_plan.total_hours_needed?.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                  
                  {studyPlan.suggestions && studyPlan.suggestions.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Suggestions:
                      </Typography>
                      {studyPlan.suggestions.map((suggestion, idx) => (
                        <Box key={idx} mt={1}>
                          {suggestion.type === 'recommendations' ? (
                            <ul>
                              {suggestion.content.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          ) : (
                            <Typography variant="body2">
                              {suggestion.title}: {suggestion.suggested_times?.length || 0} time slots suggested
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Assignments
              </Typography>
              {pendingAssignments.slice(0, 5).map((assignment) => (
                <Box key={assignment._id} mb={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                  <Typography variant="subtitle1">{assignment.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due: {format(new Date(assignment.due_date), 'PPP p')} | 
                    Priority: {assignment.priority}/5 | 
                    Estimated: {assignment.estimated_hours}h
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;

