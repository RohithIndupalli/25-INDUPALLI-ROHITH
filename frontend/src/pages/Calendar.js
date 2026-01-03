import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getUserAssignments, getUserCourses } from '../services/api';
import { format } from 'date-fns';

function CalendarPage({ userId }) {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignmentsData, coursesData] = await Promise.all([
        getUserAssignments(userId),
        getUserCourses(userId),
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentsForDate = (date) => {
    return assignments.filter(
      (assignment) =>
        format(new Date(assignment.due_date), 'yyyy-MM-dd') ===
        format(date, 'yyyy-MM-dd')
    );
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayAssignments = getAssignmentsForDate(date);
      if (dayAssignments.length > 0) {
        return (
          <Box
            sx={{
              fontSize: '0.7rem',
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            {dayAssignments.length}
          </Box>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <Container className="content-container">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const selectedDateAssignments = getAssignmentsForDate(selectedDate);

  return (
    <Container className="content-container">
      <Typography variant="h4" className="page-title">
        Calendar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={4} flexDirection={{ xs: 'column', md: 'row' }}>
        <Box flex={1}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="react-calendar"
          />
        </Box>

        <Box flex={1}>
          <Typography variant="h6" gutterBottom>
            Assignments for {format(selectedDate, 'PPP')}
          </Typography>
          {selectedDateAssignments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No assignments due on this date.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {selectedDateAssignments.map((assignment) => {
                const course = courses.find((c) => c._id === assignment.course_id);
                return (
                  <Box
                    key={assignment._id}
                    p={2}
                    bgcolor="#f5f5f5"
                    borderRadius={1}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {assignment.title}
                    </Typography>
                    {course && (
                      <Typography variant="body2" color="text.secondary">
                        {course.name} ({course.code})
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Due: {format(new Date(assignment.due_date), 'p')} | 
                      Priority: {assignment.priority}/5 | 
                      Estimated: {assignment.estimated_hours}h
                    </Typography>
                    {assignment.status !== 'completed' && (
                      <Typography
                        variant="body2"
                        color={assignment.status === 'in_progress' ? 'info.main' : 'text.secondary'}
                      >
                        Status: {assignment.status}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default CalendarPage;

