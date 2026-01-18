import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';
import 'package:mysql1/mysql1.dart';

import '../controllers/auth_controller.dart';
import '../controllers/event_controller.dart';

Middleware handleCors() {
  return (Handler handler) {
    return (Request request) async {
      if (request.method == 'OPTIONS') {
        return Response.ok(
          '',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
                'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
                'Origin, Content-Type, Authorization',
          },
        );
      }

      final response = await handler(request);
      return response.change(headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
            'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
            'Origin, Content-Type, Authorization',
      });
    };
  };
}

void main() async {
  final settings = ConnectionSettings(
    host: '34.59.182.43',
    port: 3306,
    user: 'admin',
    password: 'admin',
    db: 'EventPlanner',
  );

  try {
    final conn = await MySqlConnection.connect(settings);
    print('Conectado a MySQL');

    final router = Router();

    final authController = AuthController(conn);
    final eventController = EventController(conn);

    // AUTH
    router.post('/api/register', authController.register);
    router.post('/api/login', authController.login);

    // EVENTS
    router.get('/api/events', eventController.getAllEvents);
    router.post('/api/events', eventController.createEvent);
    router.post('/api/registrations', eventController.registerToEvent);
    router.get('/api/events/<id>/registrations', eventController.getEventRegistrations);

    // HEALTH
    router.get('/health', (_) {
      return Response.ok(
        jsonEncode({'status': 'ok'}),
        headers: {'Content-Type': 'application/json'},
      );
    });

    router.get('/events', (Request req) async {
      final result = await conn.query(
        'SELECT id, title, description, event_date, location, max_capacity '
        'FROM events '
        'WHERE event_date >= NOW() - INTERVAL 5 DAY '
        'AND event_date <= NOW() + INTERVAL 1 YEAR',
      );

      final events = result.map((row) {
        return {
          'id': row['id'],
          'title': row['title'],
          'description': row['description'],
          'eventDate': row['event_date'].toString(),
          'location': row['location'],
          'maxCapacity': row['max_capacity'],
        };
      }).toList();

      return Response.ok(
        jsonEncode(events),
        headers: {'Content-Type': 'application/json'},
      );
    });

    final handler = Pipeline()
        .addMiddleware(logRequests())
        .addMiddleware(handleCors())
        .addHandler(router);

    final server = await io.serve(handler, '0.0.0.0', 8080);
    print('Server running on http://localhost:${server.port}');
  } catch (e) {
    print('Error: $e');
  }
}
