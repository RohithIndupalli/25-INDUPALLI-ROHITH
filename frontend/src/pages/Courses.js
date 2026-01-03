import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserCourses, createCourse, deleteCourse } from '../services/api';

function Courses({ userId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    instructor: '',
    semester: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, [userId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getUserCourses(userId);
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      code: '',
      credits: 3,
      instructor: '',
      semester: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      await createCourse({
        ...formData,
        user_id: userId,
        credits: parseInt(formData.credits),
      });
      handleClose();
      await loadCourses();
    } catch (err) {
      setError('Failed to create course');
      console.error(err);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
        await loadCourses();
      } catch (err) {
        setError('Failed to delete course');
        console.error(err);
      }
    }
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
          Courses
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Box>
                    <Typography variant="h6">{course.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.code} | {course.credits} credits
                    </Typography>
                    {course.instructor && (
                      <Typography variant="body2" color="text.secondary">
                        Instructor: {course.instructor}
                      </Typography>
                    )}
                    {course.semester && (
                      <Typography variant="body2" color="text.secondary">
                        Semester: {course.semester}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(course._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Course Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Course Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Credits"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Semester"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.name || !formData.code}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Courses;

