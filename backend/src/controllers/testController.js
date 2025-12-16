const Question = require('../models/Question');
const Profession = require('../models/Profession');
const AITag = require('../models/AITag');
const User = require('../models/User');
const TestResult = require('../models/TestResult');
const AIProfile = require('../models/AIProfile');

async function submitTest(req, res) {
  try {
    const { user, answers } = req.body;

    // Create user
    const userRef = req.db.collection('users').doc();
    const newUser = new User(userRef.id, user.name, user.school, user.grade, new Date());
    await userRef.set(newUser.toFirestore());

    // Save test result
    const testRef = req.db.collection('testResults').doc();
    const testResult = new TestResult(testRef.id, userRef.id, answers, new Date());
    await testRef.set(testResult.toFirestore());

    // Calculate AI profile
    const aiProfile = await calculateAIProfile(answers, req.db);

    // Match professions
    const recommendedProfessions = await matchProfessions(aiProfile, req.db);

    // Save AI profile
    const profileRef = req.db.collection('aiProfiles').doc();
    const newProfile = new AIProfile(profileRef.id, userRef.id, aiProfile.interests, aiProfile.abilities, aiProfile.personality, aiProfile.motivation, recommendedProfessions, '');
    await profileRef.set(newProfile.toFirestore());

    res.json({
      userId: userRef.id,
      aiProfile,
      recommendedProfessions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function calculateAIProfile(answers, db) {
  const tagScores = {};
  const totalAnswers = Object.keys(answers).length;

  // Calculate scores for each aiTag
  for (const [qId, answer] of Object.entries(answers)) {
    const qDoc = await db.collection('questions').doc(qId).get();
    if (qDoc.exists) {
      const q = Question.fromFirestore(qDoc);
      q.aiTags.forEach(tag => {
        tagScores[tag] = (tagScores[tag] || 0) + answer * q.weight;
      });
    }
  }

  // Normalize scores (0-5 scale)
  Object.keys(tagScores).forEach(tag => {
    tagScores[tag] = Math.min(5, tagScores[tag] / totalAnswers);
  });

  // Categorize into interests, abilities, personality, motivation
  const interests = {};
  const abilities = {};
  const personality = {};
  const motivation = {};

  // Get aiTags to categorize
  const aiTagsSnapshot = await db.collection('aiTags').get();
  aiTagsSnapshot.docs.forEach(doc => {
    const tag = AITag.fromFirestore(doc);
    if (tagScores[tag.code] !== undefined) {
      if (tag.type === 'skill') {
        if (['programming', 'design', 'data', 'technology'].includes(tag.code)) {
          interests[tag.code] = tagScores[tag.code];
        } else {
          abilities[tag.code] = tagScores[tag.code];
        }
      } else if (tag.type === 'cognitive') {
        abilities[tag.code] = tagScores[tag.code];
      } else if (tag.type === 'soft') {
        if (['persistence', 'responsibility', 'selfDevelopment'].includes(tag.code)) {
          motivation[tag.code] = tagScores[tag.code];
        } else {
          personality[tag.code] = tagScores[tag.code];
        }
      }
    }
  });

  return { interests, abilities, personality, motivation };
}

async function matchProfessions(aiProfile, db) {
  const professionsSnapshot = await db.collection('professions').get();
  const matches = [];

  professionsSnapshot.docs.forEach(doc => {
    const prof = Profession.fromFirestore(doc);
    let score = 0;
    let total = 0;

    // Simple matching: compare scores
    Object.entries(prof.aiProfile).forEach(([key, profScore]) => {
      const userScore = aiProfile.interests[key] || aiProfile.abilities[key] || aiProfile.personality[key] || aiProfile.motivation[key] || 0;
      score += Math.abs(userScore - profScore);
      total++;
    });

    if (total > 0) {
      const similarity = 1 - (score / total / 5); // Normalize to 0-1
      matches.push({ id: prof.id, name: prof.name, similarity });
    }
  });

  // Sort by similarity and return top 5
  matches.sort((a, b) => b.similarity - a.similarity);
  return matches.slice(0, 5).map(m => m.id);
}

module.exports = {
  submitTest,
  calculateAIProfile,
  matchProfessions
};