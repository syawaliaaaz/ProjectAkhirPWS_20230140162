const db = require('../models/db');

exports.createService = (req, res) => {
    const { name, description, price } = req.body;
    db.query('INSERT INTO services (name, description, price) VALUES (?, ?, ?)',
        [name, description, price],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to add service', error: err });
            res.json({ message: 'Service added successfully' });
        });
};

exports.getServices = (req, res) => {
    db.query('SELECT * FROM services', (err, results) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch services', error: err });
        res.json(results);
    });
};

exports.updateService = (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    db.query('UPDATE services SET name=?, description=?, price=? WHERE id=?',
        [name, description, price, id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update service', error: err });
            res.json({ message: 'Service updated successfully' });
        });
};

exports.deleteService = (req, res) => {
    const { id } = req.params;
    // Hapus appointments terkait dulu
    db.query('DELETE FROM appointments WHERE service_id=?', [id], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to delete related appointments', error: err });
        // Baru hapus service
        db.query('DELETE FROM services WHERE id=?', [id], (err) => {
            if (err) return res.status(500).json({ message: 'Failed to delete service', error: err });
            res.json({ message: 'Service deleted successfully' });
        });
    });
};