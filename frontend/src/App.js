import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Calendar from './pages/Calendar';
import Agent from './pages/Agent';
import Navbar from './components/Navbar';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  useEffect(() => {
    if (!userId) {
      // Create a demo user ID for testing
      const demoUserId = 'demo-user-' + Date.now();
      localStorage.setItem('userId', demoUserId);
      setUserId(demoUserId);
    }
  }, [userId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard userId={userId} />} />
            <Route path="/courses" element={<Courses userId={userId} />} />
            <Route path="/assignments" element={<Assignments userId={userId} />} />
            <Route path="/calendar" element={<Calendar userId={userId} />} />
            <Route path="/agent" element={<Agent userId={userId} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

