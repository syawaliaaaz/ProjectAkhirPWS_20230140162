const db = require('../models/db');

exports.createDoctor = (req, res) => {
    const { name, specialization, schedule } = req.body;
    db.query('INSERT INTO doctors (name, specialization, schedule) VALUES (?, ?, ?)',
        [name, specialization, schedule],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to add doctor', error: err });
            res.json({ message: 'Doctor added successfully' });
        });
};

exports.getDoctors = (req, res) => {
    db.query('SELECT * FROM doctors', (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch doctors', error: err });
        res.json(results);
    });
};

exports.updateDoctor = (req, res) => {
    const { id } = req.params;
    const { name, specialization, schedule } = req.body;
    db.query('UPDATE doctors SET name=?, specialization=?, schedule=? WHERE id=?',
        [name, specialization, schedule, id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update doctor', error: err });
            res.json({ message: 'Doctor updated successfully' });
        });
};

exports.deleteDoctor = (req, res) => {
    const { id } = req.params;
    // Hapus appointments terkait dulu
    db.query('DELETE FROM appointments WHERE doctor_id=?', [id], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to delete related appointments', error: err });
        // Baru hapus doctor
        db.query('DELETE FROM doctors WHERE id=?', [id], (err) => {
            if (err) return res.status(500).json({ message: 'Failed to delete doctor', error: err });
            res.json({ message: 'Doctor deleted successfully' });
        });
    });
};