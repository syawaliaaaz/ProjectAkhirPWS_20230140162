const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import semua routes (Jalur diperbaiki dengan menambahkan /src/)
const authRoutes = require('./src/routes/authRoutes');
const petRoutes = require('./src/routes/petRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

// Inisialisasi Express
const app = express();
app.use(cors());
app.use(express.json());

// Routing utama
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PetCare Service API 🐾' });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));