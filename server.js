
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const hashedPassword = '$2b$10$9Ys.04R4PjqRwCEER0c9Ae0eI5jD0GX.9rAFncxnY6jSBw2HfRi9m';

app.get('/', (req, res) => {
  res.send('Сервер работает');
});

app.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Введите пароль' });
  const match = await bcrypt.compare(password, hashedPassword);
  if (match) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Неверный пароль' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен по адресу http://0.0.0.0:${PORT}`);
});