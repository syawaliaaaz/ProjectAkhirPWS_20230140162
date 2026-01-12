const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/pets', require('./src/routes/petRoutes'));
app.use('/api/doctors', require('./src/routes/doctorRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/appointments', require('./src/routes/appointmentRoutes'));

// Arahkan '/' langsung ke login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));