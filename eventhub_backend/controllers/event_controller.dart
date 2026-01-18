import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:mysql1/mysql1.dart';
import '../models/event_model.dart';
import '../models/registration_model.dart';

class EventController {
  final MySqlConnection db;

  EventController(this.db);

  // Obtener todos los eventos
  Future<Response> getAllEvents(Request request) async {
    try {
      // Hacer query a la base de datos
      var results = await db.query(
          'SELECT id, title, description, event_date, location, max_capacity FROM events');

      // Convertir resultados a lista de eventos
      List<Map<String, dynamic>> eventsList = [];
      
      for (var row in results) {
        Event event = Event.fromDatabase(row);
        eventsList.add(event.toJson());
      }

      // Enviar respuesta
      return Response.ok(
        jsonEncode({'events': eventsList}),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      print('Error: $e');
      return Response.internalServerError(
        body: jsonEncode({'error': 'Error al obtener eventos'}),
      );
    }
  }

  // Crear un nuevo evento
  Future<Response> createEvent(Request request) async {
    try {
      // Leer el body de la petición
      String body = await request.readAsString();
      Map<String, dynamic> data = jsonDecode(body);

      // Validar que los campos existen
      if (data['title'] == null || data['title'] == '') {
        return Response.badRequest(
          body: jsonEncode({'error': 'El título es requerido'}),
        );
      }

      // Crear el evento en la base de datos
      var result = await db.query(
        'INSERT INTO events (title, description, event_date, location, max_capacity) VALUES (?, ?, ?, ?, ?)',
        [
          data['title'],
          data['description'],
          data['eventDate'],
          data['location'],
          data['maxCapacity']
        ],
      );

      // Enviar respuesta exitosa
      return Response(201,
        body: jsonEncode({
          'message': 'Evento creado exitosamente',
          'id': result.insertId,
        }),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      print('Error: $e');
      return Response.internalServerError(
        body: jsonEncode({'error': 'Error al crear evento'}),
      );
    }
  }

  // Registrar usuario a un evento
  Future<Response> registerToEvent(Request request) async {
    try {
      // Leer el body de la petición
      String body = await request.readAsString();
      Map<String, dynamic> data = jsonDecode(body);

      int eventId = data['eventId'];
      String userName = data['userName'];

      // Validar que el nombre no esté vacío
      if (userName == null || userName.trim() == '') {
        return Response.badRequest(
          body: jsonEncode({'error': 'El nombre es requerido'}),
        );
      }

      // Verificar si el evento existe
      var eventCheck = await db.query(
        'SELECT id, max_capacity FROM events WHERE id = ?',
        [eventId],
      );

      if (eventCheck.isEmpty) {
        return Response.notFound(
          jsonEncode({'error': 'Evento no encontrado'}),
        );
      }

      int maxCapacity = eventCheck.first['max_capacity'];

      // Contar cuántos registros hay
      var countResult = await db.query(
        'SELECT COUNT(*) as total FROM registrations WHERE event_id = ?',
        [eventId],
      );

      int currentCount = countResult.first['total'];

      // Verificar si hay espacio
      if (currentCount >= maxCapacity) {
        return Response(409,
          body: jsonEncode({'error': 'El evento está lleno'}),
        );
      }

      // Verificar si el usuario ya está registrado
      var duplicateCheck = await db.query(
        'SELECT id FROM registrations WHERE event_id = ? AND user_name = ?',
        [eventId, userName],
      );

      if (duplicateCheck.isNotEmpty) {
        return Response(409,
          body: jsonEncode({'error': 'Ya estás registrado en este evento'}),
        );
      }

      // Crear el registro
      var result = await db.query(
        'INSERT INTO registrations (event_id, user_name) VALUES (?, ?)',
        [eventId, userName],
      );

      // Enviar respuesta exitosa
      return Response(201,
        body: jsonEncode({
          'message': 'Registro exitoso',
          'registrationId': result.insertId,
        }),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      print('Error: $e');
      return Response.internalServerError(
        body: jsonEncode({'error': 'Error al registrar'}),
      );
    }
  }

  // Obtener registros de un evento
  Future<Response> getEventRegistrations(Request request, String id) async {
    try {
      int eventId = int.parse(id);

      var results = await db.query(
        'SELECT id, event_id, user_name, registration_date FROM registrations WHERE event_id = ?',
        [eventId],
      );

      List<Map<String, dynamic>> registrationsList = [];
      
      for (var row in results) {
        Registration registration = Registration.fromDatabase(row);
        registrationsList.add(registration.toJson());
      }

      return Response.ok(
        jsonEncode({'registrations': registrationsList}),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      print('Error: $e');
      return Response.internalServerError(
        body: jsonEncode({'error': 'Error al obtener registros'}),
      );
    }
  }
}
