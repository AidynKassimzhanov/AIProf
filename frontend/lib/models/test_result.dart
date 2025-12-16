class TestResult {
  final String id;
  final String userId;
  final Map<String, String> answers; // questionId: answer
  final DateTime timestamp;

  TestResult({
    required this.id,
    required this.userId,
    required this.answers,
    required this.timestamp,
  });

  factory TestResult.fromJson(Map<String, dynamic> json) {
    return TestResult(
      id: json['id'],
      userId: json['userId'],
      answers: Map<String, String>.from(json['answers']),
      timestamp: DateTime.parse(json['timestamp']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'answers': answers,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}