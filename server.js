const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const petRoutes = require('./src/routes/petRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

// Definisi Jalur API
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Web Dashboard: http://localhost:${PORT}`);
});