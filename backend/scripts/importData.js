const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Инициализация Firebase Admin
const serviceAccount = require('../aiprof-1e0f2-firebase-adminsdk-fbsvc-47bece6151.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function importData() {
  try {
    console.log('Starting data import...');

    // Импорт aiTags
    const aiTagsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/aiTags.json'), 'utf8'));
    const aiTagsBatch = db.batch();
    aiTagsData.forEach(tag => {
      const docRef = db.collection('aiTags').doc(tag.code);
      aiTagsBatch.set(docRef, tag);
    });
    await aiTagsBatch.commit();
    console.log(`Imported ${aiTagsData.length} aiTags`);

    // Импорт professions
    const professionsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/professions.json'), 'utf8'));
    const professionsBatch = db.batch();
    professionsData.forEach(prof => {
      const docRef = db.collection('professions').doc(prof.id);
      professionsBatch.set(docRef, prof);
    });
    await professionsBatch.commit();
    console.log(`Imported ${professionsData.length} professions`);

    // Импорт questions
    const questionsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/questions.json'), 'utf8'));
    const questionsBatch = db.batch();
    questionsData.forEach(q => {
      const docRef = db.collection('questions').doc(q.code);
      questionsBatch.set(docRef, q);
    });
    await questionsBatch.commit();
    console.log(`Imported ${questionsData.length} questions`);

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    admin.app().delete();
  }
}

importData();