import 'dart:convert';
import 'package:mysql1/mysql1.dart';

class Event {
  int? id;
  String title;
  String description;
  DateTime eventDate;
  String location;
  int maxCapacity;

  Event({
    this.id,
    required this.title,
    required this.description,
    required this.eventDate,
    required this.location,
    required this.maxCapacity,
  });

  // Convertir JSON a Event
  Event.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        title = json['title'],
        description = json['description'],
        eventDate = DateTime.parse(json['eventDate']),
        location = json['location'],
        maxCapacity = json['maxCapacity'];

  // Convertir fila de base de datos a Event
  Event.fromDatabase(dynamic row)
      : id = row['id'],
        title = _fieldToString(row['title']),
        description = _fieldToString(row['description']),
        eventDate = row['event_date'],
        location = _fieldToString(row['location']),
        maxCapacity = row['max_capacity'];

  // Convertir Event a JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'eventDate': eventDate.toIso8601String(),
      'location': location,
      'maxCapacity': maxCapacity,
    };
  }
}

String _fieldToString(dynamic value) {
  if (value == null) return '';
  if (value is Blob) {
    return utf8.decode(value.toBytes());
  }
  return value.toString();
}