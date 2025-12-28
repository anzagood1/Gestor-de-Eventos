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

  Future<Response> createEvent(Request request) async {
    try {
      final payload = jsonDecode(await request.readAsString());
      
      final result = await _db.query(
        'INSERT INTO events (title, description, event_date, location, max_capacity) VALUES (?, ?, ?, ?, ?)',
        [payload['title'], payload['description'], payload['date'], payload['location'], payload['maxCapacity']]
      );

      return Response.ok(
        jsonEncode({'message': 'Evento creado con éxito', 'id': result.insertId}),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: 'Error al crear evento: $e');
    }
  }

  Future<Response> registerToEvent(Request request) async {
    try {
      final payload = jsonDecode(await request.readAsString());
      final int eventId = payload['eventId'];
      final String userName = payload['userName'];

      final result = await _db.query(
        'INSERT INTO registrations (event_id, user_name) VALUES (?, ?)',
        [eventId, userName]
      );

      return Response.ok(
        jsonEncode({
          'status': 'registered',
          'message': 'Inscripción procesada por Gilmar Muñoz',
          'registrationId': result.insertId
        }),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      return Response.internalServerError(body: 'Error en la inscripción de Gilmar Muñoz: $e');
    }
  }

}
