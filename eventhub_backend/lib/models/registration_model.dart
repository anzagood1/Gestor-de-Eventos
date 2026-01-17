class Registration {
  int? id;
  int eventId;
  String userName;
  DateTime? registrationDate;

  Registration({
    this.id,
    required this.eventId,
    required this.userName,
    this.registrationDate,
  });

  // Convertir JSON a Registration
  Registration.fromJson(Map<String, dynamic> json)
      : id = json['id'],
        eventId = json['eventId'],
        userName = json['userName'],
        registrationDate = json['registrationDate'] != null
            ? DateTime.parse(json['registrationDate'])
            : null;

  // Convertir fila de base de datos a Registration
  Registration.fromDatabase(dynamic row)
      : id = row['id'],
        eventId = row['event_id'],
        userName = row['user_name'],
        registrationDate = row['registration_date'];

  // Convertir Registration a JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'eventId': eventId,
      'userName': userName,
      'registrationDate': registrationDate?.toIso8601String(),
    };
  }
}