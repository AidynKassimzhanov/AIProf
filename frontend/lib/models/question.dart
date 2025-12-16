class Question {
  final String id;
  final String text;
  final String type;
  final List<String> aiTags;
  final int weight;
  final String stage;
  final bool active;

  Question({
    required this.id,
    required this.text,
    required this.type,
    required this.aiTags,
    required this.weight,
    required this.stage,
    required this.active,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'],
      text: json['text'],
      type: json['type'],
      aiTags: List<String>.from(json['aiTags']),
      weight: json['weight'],
      stage: json['stage'],
      active: json['active'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'type': type,
      'aiTags': aiTags,
      'weight': weight,
      'stage': stage,
      'active': active,
    };
  }
}