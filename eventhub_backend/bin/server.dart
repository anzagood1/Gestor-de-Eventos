import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';
import 'package:mysql1/mysql1.dart';
import '../lib/controllers/event_controller.dart';

// Middleware para CORS (permitir peticiones desde React)
Response corsMiddleware(Response response) {
  return response.change(headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type',
  });
}

Middleware handleCors() {
  return (Handler handler) {
    return (Request request) async {
      // Si es una petición OPTIONS, responder inmediatamente
      if (request.method == 'OPTIONS') {
        return corsMiddleware(Response.ok(''));
      }
      
      // Procesar la petición normal y agregar headers CORS
      Response response = await handler(request);
      return corsMiddleware(response);
    };
  };
}

void main() async {
  // Configuración de la base de datos
  var settings = ConnectionSettings(
    host: '34.59.182.43',
    port: 3306,
    user: 'admin',
    password: 'admin',
    db: 'EventPlanner',
  );

  print('Conectando a la base de datos...');

  try {
    // Conectar a la base de datos
    var conn = await MySqlConnection.connect(settings);
    print('Conectado a la base de datos');

    // Crear el controlador
    var eventController = EventController(conn);

    // Crear las rutas
    var app = Router();

    // Rutas de eventos
    app.get('/api/events', eventController.getAllEvents);
    app.post('/api/events', eventController.createEvent);

    // Rutas de registros
    app.post('/api/registrations', eventController.registerToEvent);
    app.get('/api/events/<id>/registrations', eventController.getEventRegistrations);

    // Ruta de prueba
    app.get('/health', (Request request) {
      return Response.ok('El servidor se encuentra en linea!');
    });

    // Configurar middlewares
    var handler = Pipeline()
        .addMiddleware(logRequests())
        .addMiddleware(handleCors())
        .addHandler(app);

    // Iniciar el servidor
    var server = await io.serve(handler, '0.0.0.0', 8080);
    print('Servidor corriendo en http://localhost:${server.port}');
    print('Endpoints disponibles:');
    print('  - GET  http://localhost:${server.port}/api/events');
    print('  - POST http://localhost:${server.port}/api/events');
    print('  - POST http://localhost:${server.port}/api/registrations');
    print('  - GET  http://localhost:${server.port}/api/events/<id>/registrations');

  } catch (e) {
    print('✗ Error: $e');
  }
}