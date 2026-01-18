import 'package:mysql1/mysql1.dart';

class UserModel {
  final _settings = ConnectionSettings(
    host: 'localhost',
    port: 3306,
    user: 'admin',
    password: 'admin',
    db: 'EventPlanner',
  );

  Future<Map<String, dynamic>> createUser({
    required String userName,
    required String email,
    required String password,
  }) async {
    final conn = await MySqlConnection.connect(_settings);

    final result = await conn.query(
      'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
      [userName, email, password],
    );

    await conn.close();

    return {
      'id': result.insertId,
      'userName': userName,
      'email': email,
    };
  }
}
