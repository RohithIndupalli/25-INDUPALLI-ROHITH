import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { sendChatMessage, getChatHealth } from '../services/api';

function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    checkHealth();
    // Add welcome message
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm your study planning assistant. I can help you with time management, study tips, assignment planning, and academic advice. How can I assist you today?",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkHealth = async () => {
    try {
      const healthData = await getChatHealth();
      setHealth(healthData);
    } catch (err) {
      console.error('Failed to check chat health:', err);
      setHealth({ status: 'unavailable', llm_available: false });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
    };

    // Add user message to chat
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(newMessages, userId);
      
      // Add assistant response to chat
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.message,
        },
      ]);
    } catch (err) {
      let errorMessage = 'Failed to send message. ';
      if (err.response) {
        errorMessage += err.response.data?.detail || err.response.data?.message || 'Backend error occurred.';
      } else if (err.request) {
        errorMessage += 'Backend is not reachable. Make sure the backend server is running.';
      } else {
        errorMessage += 'An unexpected error occurred.';
      }
      setError(errorMessage);
      console.error('Chat error:', err);
      
      // Add error message to chat
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container className="content-container" maxWidth="lg">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" className="page-title">
          Study Chat Assistant
        </Typography>
        {health && (
          <Chip
            label={health.llm_available ? 'Online' : 'Offline'}
            color={health.llm_available ? 'success' : 'default'}
            size="small"
          />
        )}
      </Box>

      {health && !health.llm_available && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Chat service is currently unavailable. Please configure HUGGINGFACE_API_KEY in your backend environment variables.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={3}
        sx={{
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          mb: 2,
        }}
      >
        {/* Messages area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
            >
              {message.role === 'assistant' && (
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SmartToyIcon />
                </Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                  color: message.role === 'user' ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
              </Paper>
              {message.role === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <SmartToyIcon />
              </Avatar>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.100' }}>
                <CircularProgress size={20} />
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input area */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
          }}
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message... (Press Enter to send)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || (health && !health.llm_available)}
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={loading || !inputMessage.trim() || (health && !health.llm_available)}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ minWidth: 100 }}
          >
            Send
          </Button>
        </Box>
      </Paper>

      {health && health.model && (
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
          Powered by {health.model}
        </Typography>
      )}
    </Container>
  );
}

export default Chat;

