import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:mysql1/mysql1.dart';

class EventController {
  final MySqlConnection _db;

  EventController(this._db);

  
  Future<Response> getAllEvents(Request request) async {
    try {
      final results = await _db.query(
        'SELECT id, title, description, event_date, location, max_capacity FROM events'
      );

      final eventsList = results.map((row) => {
        'id': row[0],
        'title': row[1]?.toString(),
        'description': row[2]?.toString(),
        'date': row[3].toString(),
        'location': row[4]?.toString(),
        'maxCapacity': row[5],
      }).toList();

      return Response.ok(
        jsonEncode(eventsList),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: 'Error: $e');
    }
  }
}
