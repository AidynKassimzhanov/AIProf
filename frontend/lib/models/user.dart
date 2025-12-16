class User {
  final String id;
  final String name;
  final String school; // школа
  final String grade; // класс (9-11)
  final DateTime createdAt;

  User({
    required this.id,
    required this.name,
    required this.school,
    required this.grade,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      school: json['school'],
      grade: json['grade'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'school': school,
      'grade': grade,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}