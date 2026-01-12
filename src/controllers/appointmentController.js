const db = require('../models/db');

// Create Appointment (Untuk User)
exports.createAppointment = (req, res) => {
    const { pet_id, doctor_id, service_id, date } = req.body;
    const userId = req.user.id;

    db.query(
        'INSERT INTO appointments (user_id, pet_id, doctor_id, service_id, date, status) VALUES (?, ?, ?, ?, ?, "pending")',
        [userId, pet_id, doctor_id, service_id, date],
        (err) => {
            if (err) return res.status(500).json({ message: 'Gagal membuat janji temu', error: err });
            res.json({ message: 'Janji temu berhasil dibuat!' });
        }
    );
};

// Get Appointments (Otomatis membedakan Admin dan User)
exports.getAppointments = (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    // Tambahkan a.user_id agar admin tahu ini janji milik siapa
    let query = `
        SELECT a.id, p.name AS pet_name, d.name AS doctor_name, s.name AS service_name, a.date, a.status, a.user_id
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
    
    query += " ORDER BY a.date DESC"; // Urutkan dari yang terbaru

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data', error: err });
        res.json(results);
    });
};

// Update Status (KHUSUS ADMIN)
exports.updateAppointment = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'acc', 'rejected', 'reschedule'
    const role = req.user.role;

    // Keamanan: Cek apakah yang akses adalah admin
    if (role !== 'admin') {
        return res.status(403).json({ message: 'Hanya Admin yang boleh mengubah status!' });
    }

    db.query('UPDATE appointments SET status=? WHERE id=?', [status, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal update status', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Data tidak ditemukan' });
        
        res.json({ message: `Janji temu berhasil di-${status.toUpperCase()}` });
    });
};

// Delete Appointment (ADMIN ONLY)
exports.deleteAppointment = (req, res) => {
    const { id } = req.params;
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Akses ditolak' });

    db.query('DELETE FROM appointments WHERE id=?', [id], (err) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus', error: err });
        res.json({ message: 'Janji temu berhasil dihapus' });
    });
};