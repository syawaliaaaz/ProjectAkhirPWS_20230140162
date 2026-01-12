const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  
  // Tambahkan validasi input kosong
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashed = bcrypt.hashSync(password, 8);

  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashed],
    (err) => {
      if (err) return res.status(500).json({ message: 'Registration failed', error: err });
      res.json({ message: 'User registered successfully' });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    // Pastikan process.env.JWT_SECRET terisi di file .env
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, name: user.name, role: user.role } 
    });
  });
};