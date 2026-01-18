import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:mysql1/mysql1.dart';
import 'package:crypto/crypto.dart';

class AuthController {
  final MySqlConnection conn;

  AuthController(this.conn);

  String _hashPassword(String password) {
    return sha256.convert(utf8.encode(password)).toString();
  }

  // REGISTER
  Future<Response> register(Request request) async {
    try {
      final body = await request.readAsString();
      final data = jsonDecode(body);

      final userName = data['userName'];
      final email = data['email'];
      final password = data['password'];

      if (userName == null || email == null || password == null) {
        return Response(
          400,
          body: jsonEncode({'error': 'Datos incompletos'}),
          headers: {'Content-Type': 'application/json'},
        );
      }

      final hashedPassword = _hashPassword(password);

      await conn.query(
        '''
        INSERT INTO users (userName, email, password)
        VALUES (?, ?, ?)
        ''',
        [userName, email, hashedPassword],
      );

      return Response.ok(
        jsonEncode({'message': 'Usuario registrado correctamente'}),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      return Response(
        500,
        body: jsonEncode({'error': e.toString()}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  }

  // LOGIN
  Future<Response> login(Request request) async {
    try {
      final body = await request.readAsString();
      final data = jsonDecode(body);

      final email = data['email'];
      final password = data['password'];

      if (email == null || password == null) {
        return Response(
          400,
          body: jsonEncode({'error': 'Datos incompletos'}),
          headers: {'Content-Type': 'application/json'},
        );
      }

      final hashedPassword = _hashPassword(password);

      final result = await conn.query(
        '''
        SELECT id, userName, email
        FROM users
        WHERE email = ? AND password = ?
        ''',
        [email, hashedPassword],
      );

      if (result.isEmpty) {
        return Response(
          401,
          body: jsonEncode({'error': 'Credenciales inválidas'}),
          headers: {'Content-Type': 'application/json'},
        );
      }

      final user = result.first;

      return Response.ok(
        jsonEncode({
          'id': user['id'],
          'userName': user['userName'],
          'email': user['email'],
        }),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      return Response(
        500,
        body: jsonEncode({'error': e.toString()}),
        headers: {'Content-Type': 'application/json'},
      );
    }
  }
}