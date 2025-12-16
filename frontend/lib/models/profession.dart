class Profession {
  final String id;
  final String name;
  final String college;
  final Map<String, int> aiProfile;

  Profession({
    required this.id,
    required this.name,
    required this.college,
    required this.aiProfile,
  });

  factory Profession.fromJson(Map<String, dynamic> json) {
    return Profession(
      id: json['id'],
      name: json['name'],
      college: json['college'],
      aiProfile: Map<String, int>.from(json['aiProfile']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'college': college,
      'aiProfile': aiProfile,
    };
  }
}