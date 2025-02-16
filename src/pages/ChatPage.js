// src/pages/ChatPage.js
import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Grid, Typography } from '@mui/material';

function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // تابع برای ارسال پیام
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage(''); // پاک کردن ورودی پس از ارسال پیام
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      {/* عنوان صفحه چت */}
      <Typography variant="h4" align="center" gutterBottom>
        چت با دوستان
      </Typography>

      {/* نمایش پیام‌ها */}
      <List style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText primary={msg} />
          </ListItem>
        ))}
      </List>

      {/* ورودی پیام */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={10}>
          <TextField
            fullWidth
            variant="outlined"
            label="پیام خود را وارد کنید"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSendMessage}
          >
            ارسال
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ChatPage;
