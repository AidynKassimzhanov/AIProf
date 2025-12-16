const Profession = require('../models/Profession');

async function getProfessions(req, res) {
  try {
    const snapshot = await req.db.collection('professions').get();
    const professions = snapshot.docs.map(doc => Profession.fromFirestore(doc));
    res.json(professions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getProfessions
};