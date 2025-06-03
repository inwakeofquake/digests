const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3001;

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  next();
});

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Body parsing middleware
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('Invalid JSON:', e);
      res.status(400).json({ error: 'Invalid JSON' });
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve static files from the current directory
app.use(express.static(__dirname, {
    index: 'login.html',
    extensions: ['html']
}));

const hashedPassword = '$2b$10$9Ys.04R4PjqRwCEER0c9Ae0eI5jD0GX.9rAFncxnY6jSBw2HfRi9m';

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', async (req, res) => {
  try {
    console.log('Login attempt - Raw body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Add validation
    if (!req.body) {
      console.log('No request body received');
      return res.status(400).json({ 
        success: false, 
        message: 'No request body received' 
      });
    }

    if (!req.body.password) {
      console.log('No password in request body');
      return res.status(400).json({ 
        success: false, 
        message: 'Введите пароль' 
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
      message: 'Ошибка сервера' 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен по адресу http://0.0.0.0:${PORT}`);
});