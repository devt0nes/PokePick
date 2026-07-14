const express = require('express');
const router = express.Router();

const Contact = require("../models/Contact");

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
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
    const newMessage = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

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

  } catch(err) {
    console.error("Error saving contact message:", err);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

// Get all contact messages (for admin purposes)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch messages",
    });
  }
});

// Mark message as read
router.put('/messages/:id/read', async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true, message });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to update message",
    });
  }
});

// Delete message
router.delete('/messages/:id', async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if(!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted' });
  
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete message",
    });
  }
});

module.exports = router; 