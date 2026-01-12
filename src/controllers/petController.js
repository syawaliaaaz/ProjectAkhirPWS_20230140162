const db = require('../models/db');

exports.createPet = (req, res) => {
  const { name, species, age } = req.body;
  const userId = req.user.id;

  db.query('INSERT INTO pets (user_id, name, species, age) VALUES (?, ?, ?, ?)',
    [userId, name, species, age],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to add pet', error: err });
      res.json({ message: 'Pet added successfully' });
    });
};

exports.getPets = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM pets WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch pets', error: err });
    res.json(results);
  });
};

exports.updatePet = (req, res) => {
  const { id } = req.params;
  const { name, species, age } = req.body;

  db.query('UPDATE pets SET name=?, species=?, age=? WHERE id=?',
    [name, species, age, id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update pet', error: err });
      res.json({ message: 'Pet updated successfully' });
    });
};

exports.deletePet = (req, res) => {
  const { id } = req.params;
  // Hapus appointments terkait dulu
  db.query('DELETE FROM appointments WHERE pet_id=?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete related appointments', error: err });
    // Baru hapus pet
    db.query('DELETE FROM pets WHERE id=?', [id], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete pet', error: err });
      res.json({ message: 'Pet deleted successfully' });
    });
  });
};

