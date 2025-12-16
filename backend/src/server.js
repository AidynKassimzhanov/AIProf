const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
const Question = require('./models/Question');
const Profession = require('./models/Profession');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://aiprof-1e0f2.firebaseio.com'
});

const db = admin.firestore();

// Routes
// Получение вопросов
app.get('/api/questions', async (req, res) => {
  try {
    const stage = req.query.stage || 'core';
    const snapshot = await db.collection('questions').where('stage', '==', stage).where('active', '==', true).get();
    const questions = snapshot.docs.map(doc => Question.fromFirestore(doc));
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение профессий
app.get('/api/professions', async (req, res) => {
  try {
    const snapshot = await db.collection('professions').get();
    const professions = snapshot.docs.map(doc => Profession.fromFirestore(doc));
    res.json(professions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение адаптивных вопросов
app.post('/api/get-adaptive-questions', async (req, res) => {
  try {
    const { answers } = req.body;
    // Simple logic: calculate scores and select questions for low-scored tags
    const tagScores = {};
    for (const [qId, answer] of Object.entries(answers)) {
      const qDoc = await db.collection('questions').doc(qId).get();
      if (qDoc.exists) {
        const q = Question.fromFirestore(qDoc);
        q.aiTags.forEach(tag => {
          tagScores[tag] = (tagScores[tag] || 0) + answer * q.weight;
        });
      }
    }
    // Find tags with low scores (<3) and get questions for them
    const lowTags = Object.keys(tagScores).filter(tag => tagScores[tag] < 3);
    if (lowTags.length === 0) {
      return res.json([]); // No need for more questions
    }
    const adaptiveQuestions = [];
    for (const tag of lowTags) {
      const qSnapshot = await db.collection('questions').where('aiTags', 'array-contains', tag).where('stage', '==', 'adaptive').limit(2).get();
      qSnapshot.docs.forEach(doc => {
        adaptiveQuestions.push(Question.fromFirestore(doc));
      });
    }
    res.json(adaptiveQuestions.slice(0, 10)); // Limit to 10
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/submit-test', async (req, res) => {
  // Process test results and generate AI profile
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});