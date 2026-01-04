import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

// Courses
export const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

export const getUserCourses = async (userId) => {
  const response = await api.get(`/courses/user/${userId}`);
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await api.put(`/courses/${courseId}`, courseData);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data;
};

// Assignments
export const createAssignment = async (assignmentData) => {
  const response = await api.post('/assignments', assignmentData);
  return response.data;
};

export const getUserAssignments = async (userId, status = null) => {
  const url = status 
    ? `/assignments/user/${userId}?status=${status}`
    : `/assignments/user/${userId}`;
  const response = await api.get(url);
  return response.data;
};

export const updateAssignment = async (assignmentId, assignmentData) => {
  const response = await api.put(`/assignments/${assignmentId}`, assignmentData);
  return response.data;
};

export const deleteAssignment = async (assignmentId) => {
  const response = await api.delete(`/assignments/${assignmentId}`);
  return response.data;
};

// Agent
export const runStudyPlanning = async (userId) => {
  const response = await api.post(`/agent/plan/${userId}`);
  return response.data;
};

export const getAgentHealth = async () => {
  const response = await api.get('/agent/health');
  return response.data;
};

// Chat
export const sendChatMessage = async (messages, userId = null) => {
  const response = await api.post('/chat/', {
    messages: messages,
    user_id: userId,
  });
  return response.data;
};

export const getChatHealth = async () => {
  const response = await api.get('/chat/health');
  return response.data;
};

export default api;

