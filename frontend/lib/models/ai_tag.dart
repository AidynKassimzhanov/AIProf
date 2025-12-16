class AITag {
  final String code;
  final String name;
  final String ru;
  final String type; // skill, cognitive, soft
  final List<String> professions; // profession codes

  AITag({
    required this.code,
    required this.name,
    required this.ru,
    required this.type,
    required this.professions,
  });

  factory AITag.fromJson(Map<String, dynamic> json) {
    return AITag(
      code: json['code'],
      name: json['name'],
      ru: json['ru'],
      type: json['type'],
      professions: List<String>.from(json['professions']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'name': name,
      'ru': ru,
      'type': type,
      'professions': professions,
    };
  }
}