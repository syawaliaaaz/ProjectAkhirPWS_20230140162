const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  // 1. Tambahkan 'role' agar bisa ditangkap dari frontend
  const { name, email, password, role } = req.body; 
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // 2. Berikan default 'user' jika role tidak dipilih
  const userRole = role || 'user'; 

  const hashed = bcrypt.hashSync(password, 8);

  // 3. Update Query untuk memasukkan role ke tabel users
  db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashed, userRole],
    (err) => {
      if (err) return res.status(500).json({ message: 'Registration failed', error: err });
      res.json({ message: 'User registered successfully' });
    });
};

exports.login = (req, res) => {
  // 4. Tangkap 'role' dari body login
  const { email, password, role } = req.body; 

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  // 5. Cari user berdasarkan Email DAN Role supaya tidak tertukar
  db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    
    // Jika email benar tapi role salah, akan muncul "User not found"
    if (results.length === 0) return res.status(404).json({ message: 'User not found for this role' });

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

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