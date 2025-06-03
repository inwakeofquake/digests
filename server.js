const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path'); // Don't forget to require 'path'
const app = express();
const PORT = 3001;

// Middleware setup (CRITICAL FIXES)
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded forms
app.use(express.static(path.join(__dirname))); // Serves static files

const hashedPassword = '$2b$10$9Ys.04R4PjqRwCEER0c9Ae0eI5jD0GX.9rAFncxnY6jSBw2HfRi9m';

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html')); // Fixed path
});

app.post('/login', async (req, res) => {
  try {
    // Add validation
    if (!req.body || !req.body.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password is required' 
      });
    }

    const { password } = req.body;
    const match = await bcrypt.compare(password, hashedPassword);
    
    if (match) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Неверный пароль' 
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен по адресу http://0.0.0.0:${PORT}`);
});