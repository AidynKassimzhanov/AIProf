class Question {
  constructor(id, text, type, aiTags, weight, stage, active) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.aiTags = aiTags; // array
    this.weight = weight;
    this.stage = stage;
    this.active = active;
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Question(doc.id, data.text, data.type, data.aiTags, data.weight, data.stage, data.active);
  }

  toFirestore() {
    return {
      text: this.text,
      type: this.type,
      aiTags: this.aiTags,
      weight: this.weight,
      stage: this.stage,
      active: this.active,
    };
  }
}

module.exports = Question;