import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import {
  getUserAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getUserCourses,
} from '../services/api';

function Assignments({ userId }) {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
    priority: 3,
    estimated_hours: 2,
    status: 'pending',
    category: '',
  });
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

  const handleOpen = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        title: assignment.title,
        description: assignment.description || '',
        course_id: assignment.course_id,
        due_date: assignment.due_date ? format(new Date(assignment.due_date), "yyyy-MM-dd'T'HH:mm") : '',
        priority: assignment.priority,
        estimated_hours: assignment.estimated_hours,
        status: assignment.status,
        category: assignment.category || '',
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        title: '',
        description: '',
        course_id: courses[0]?._id || '',
        due_date: '',
        priority: 3,
        estimated_hours: 2,
        status: 'pending',
        category: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAssignment(null);
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      const assignmentData = {
        ...formData,
        user_id: userId,
        due_date: new Date(formData.due_date).toISOString(),
        estimated_hours: parseFloat(formData.estimated_hours),
        priority: parseInt(formData.priority),
      };

      if (editingAssignment) {
        await updateAssignment(editingAssignment._id, assignmentData);
      } else {
        await createAssignment(assignmentData);
      }
      handleClose();
      await loadData();
    } catch (err) {
      setError('Failed to save assignment');
      console.error(err);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignmentId);
        await loadData();
      } catch (err) {
        setError('Failed to delete assignment');
        console.error(err);
      }
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 4) return 'error';
    if (priority >= 3) return 'warning';
    return 'info';
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'success';
    if (status === 'in_progress') return 'info';
    return 'default';
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

  return (
    <Container className="content-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" className="page-title">
          Assignments
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Assignment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        {assignments.map((assignment) => {
          const course = courses.find(c => c._id === assignment.course_id);
          const isOverdue = new Date(assignment.due_date) < new Date() && assignment.status !== 'completed';
          
          return (
            <Card key={assignment._id} sx={{ bgcolor: isOverdue ? '#ffebee' : 'white' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Box flex={1}>
                    <Box display="flex" gap={1} alignItems="center" mb={1}>
                      <Typography variant="h6">{assignment.title}</Typography>
                      <Chip
                        label={`Priority ${assignment.priority}`}
                        color={getPriorityColor(assignment.priority)}
                        size="small"
                      />
                      <Chip
                        label={assignment.status}
                        color={getStatusColor(assignment.status)}
                        size="small"
                      />
                    </Box>
                    {assignment.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {assignment.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Course: {course?.name || assignment.course_id} | 
                      Due: {format(new Date(assignment.due_date), 'PPP p')} | 
                      Estimated: {assignment.estimated_hours}h
                    </Typography>
                    {assignment.category && (
                      <Typography variant="body2" color="text.secondary">
                        Category: {assignment.category}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpen(assignment)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(assignment._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Course</InputLabel>
            <Select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              label="Course"
              required
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Due Date & Time"
            type="datetime-local"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <Box display="flex" gap={2}>
            <TextField
              label="Priority (1-5)"
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              margin="normal"
              inputProps={{ min: 1, max: 5 }}
              required
            />
            <TextField
              label="Estimated Hours"
              type="number"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
              margin="normal"
              inputProps={{ min: 0, step: 0.5 }}
              required
            />
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.course_id || !formData.due_date}
          >
            {editingAssignment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Assignments;

