const express = require('express');
const router = express.Router();

// In-memory storage for contact messages (replace with database later)
let contactMessages = [];

// Submit contact form
router.post('/submit', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      error: 'All fields are required' 
    });
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Please enter a valid email address' 
    });
  }
  
  // Create message object
  const newMessage = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    status: 'unread'
  };
  
  // Store message
  contactMessages.push(newMessage);
  
  // Log the message (in production, you'd send an email notification)
  console.log('New contact message received:', {
    from: newMessage.name,
    email: newMessage.email,
    subject: newMessage.subject,
    message: newMessage.message.substring(0, 100) + '...'
  });
  
  res.json({ 
    success: true, 
    message: 'Thank you for your message! We\'ll get back to you soon.',
    messageId: newMessage.id
  });
});

// Get all contact messages (for admin purposes)
router.get('/messages', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ messages: contactMessages });
});

// Mark message as read
router.put('/messages/:id/read', (req, res) => {
  const { id } = req.params;
  const message = contactMessages.find(m => m.id === parseInt(id));
  
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  message.status = 'read';
  res.json({ success: true, message });
});

// Delete message
router.delete('/messages/:id', (req, res) => {
  const { id } = req.params;
  const messageIndex = contactMessages.findIndex(m => m.id === parseInt(id));
  
  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  contactMessages.splice(messageIndex, 1);
  res.json({ success: true, message: 'Message deleted' });
});

module.exports = router; 