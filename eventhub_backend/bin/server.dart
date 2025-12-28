import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';
import 'package:mysql1/mysql1.dart';

import '../lib/controllers/event_controller.dart';

void main() async {
  // Configuración de conexión a Google Cloud SQL

  final settings = ConnectionSettings(
    host: '34.59.182.43', // IP de la instancia en Google Cloud
    port: 3306,
    user: 'admin',
    password: 'admin',
    db: 'EventPlanner',
    timeout: Duration(seconds: 30),
  );

  print('Conectando a base de datos');

  try {
    final conn = await MySqlConnection.connect(settings);
    print('Conexión establecida con éxito a la base de datos.');

    final eventController = EventController(conn);
    final app = Router();

    app.get('/events', eventController.getAllEvents);
    app.post('/events', eventController.createEvent);
    app.post('/registrations', eventController.registerToEvent);


    // Pipeline para manejo de errores y logs
    final handler = Pipeline()
        .addMiddleware(logRequests())
        .addHandler(app);

    // Iniciar el servidor localmente
    final server = await io.serve(handler, '0.0.0.0', 8080);
    print('Servidor Backend activo en http://${server.address.host}:${server.port}');
    
  } catch (e) {
    print('Error crítico al iniciar el servidor o conectar a la BD: $e');
  }
}