const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://aiprof-1e0f2.firebaseio.com'
});

const db = admin.firestore();

// Middleware to pass db to controllers
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Controllers
const { getQuestions, getAdaptiveQuestions } = require('./controllers/questionController');
const { getProfessions } = require('./controllers/professionController');
const { submitTest } = require('./controllers/testController');

// Routes
// Получение вопросов
app.get('/api/questions', (req, res) => getQuestions(req, res));

// Получение профессий
app.get('/api/professions', (req, res) => getProfessions(req, res));

// Получение адаптивных вопросов
app.post('/api/get-adaptive-questions', (req, res) => getAdaptiveQuestions(req, res));

app.post('/api/submit-test', (req, res) => submitTest(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});