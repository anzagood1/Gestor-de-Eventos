// model/event_model.dart
class Event {
  final int? id;
  final String title;
  final String description;
  final DateTime eventDate;
  final String location;
  final int maxCapacity;

  Event({this.id, required this.title, required this.description, 
         required this.eventDate, required this.location, required this.maxCapacity});

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'eventDate': eventDate.toIso8601String(),
    'location': location,
    'maxCapacity': maxCapacity,
  };
}