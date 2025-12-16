class AIProfile {
  final String id;
  final String userId;
  final Map<String, double> interests; // aiTag: score
  final Map<String, double> abilities;
  final Map<String, double> personality;
  final Map<String, double> motivation;
  final List<String> recommendedProfessions; // professionIds
  final String interpretation; // LLM-generated text

  AIProfile({
    required this.id,
    required this.userId,
    required this.interests,
    required this.abilities,
    required this.personality,
    required this.motivation,
    required this.recommendedProfessions,
    required this.interpretation,
  });

  factory AIProfile.fromJson(Map<String, dynamic> json) {
    return AIProfile(
      id: json['id'],
      userId: json['userId'],
      interests: Map<String, double>.from(json['interests']),
      abilities: Map<String, double>.from(json['abilities']),
      personality: Map<String, double>.from(json['personality']),
      motivation: Map<String, double>.from(json['motivation']),
      recommendedProfessions: List<String>.from(json['recommendedProfessions']),
      interpretation: json['interpretation'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'interests': interests,
      'abilities': abilities,
      'personality': personality,
      'motivation': motivation,
      'recommendedProfessions': recommendedProfessions,
      'interpretation': interpretation,
    };
  }
}