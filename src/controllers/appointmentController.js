const db = require('../models/db');

exports.createAppointment = (req, res) => {
    const { pet_id, doctor_id, service_id, date } = req.body;
    const userId = req.user.id; // Diambil dari token JWT via middleware

    db.query(
        'INSERT INTO appointments (user_id, pet_id, doctor_id, service_id, date, status) VALUES (?, ?, ?, ?, ?, "pending")',
        [userId, pet_id, doctor_id, service_id, date],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to create appointment', error: err });
            res.json({ message: 'Appointment created successfully' });
        }
    );
};

exports.getAppointments = (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    // Jika admin, tampilkan semua janji temu. Jika user, hanya miliknya.
    let query = `
        SELECT a.id, p.name AS pet_name, d.name AS doctor_name, s.name AS service_name, a.date, a.status
        FROM appointments a
        JOIN pets p ON a.pet_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN services s ON a.service_id = s.id
    `;
    
    let params = [];
    if (role !== 'admin') {
        query += " WHERE a.user_id = ?";
        params.push(userId);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch appointments', error: err });
        res.json(results);
    });
};

exports.updateAppointment = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Misal: 'confirmed', 'completed', 'cancelled'
    db.query('UPDATE appointments SET status=? WHERE id=?', [status, id], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to update appointment', error: err });
        res.json({ message: 'Appointment updated successfully' });
    });
};

exports.deleteAppointment = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM appointments WHERE id=?', [id], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to delete appointment', error: err });
        res.json({ message: 'Appointment deleted successfully' });
    });
};