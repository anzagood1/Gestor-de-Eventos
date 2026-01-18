# Gestor de Eventos

Aplicación full‑stack para gestionar eventos con registro de usuarios.

Este proyecto tiene:
- Backend en Dart (shelf + MySQL)
- Frontend en React + Vite (TypeScript)

---

## 1. Requisitos previos

- MySQL instalado (local o en un servidor propio)
- Dart SDK instalado
- Node.js + npm instalados

---

## 2. Crear base de datos y tablas

En tu servidor MySQL (por ejemplo con MySQL Workbench o consola), crea una base de datos, por ejemplo `EventPlanner` y ejecuta estas sentencias:

```sql
CREATE DATABASE EventPlanner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE EventPlanner;

CREATE TABLE events (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(100) NOT NULL,
		description TEXT,
		event_date DATETIME NOT NULL,
		location VARCHAR(100) NOT NULL,
		max_capacity INT NOT NULL
);

CREATE TABLE usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	userName VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE registrations (
		id INT AUTO_INCREMENT PRIMARY KEY,
		event_id INT NOT NULL,
		user_name VARCHAR(100) NOT NULL,
		FOREIGN KEY (event_id) REFERENCES events(id)
				ON DELETE CASCADE
				ON UPDATE CASCADE
);
```

---

## 3. Configurar el backend (Dart + MySQL)

Archivo de configuración principal del servidor:
- `eventhub_backend/bin/server.dart`

Dentro de `server.dart` hay una sección como esta:

```dart
final settings = ConnectionSettings(
	host: 'TU_HOST',
	port: 3306,
	user: 'TU_USUARIO',
	password: 'TU_PASSWORD',
	db: 'EventPlanner',
);
```

Actualiza `host`, `user`, `password` y, si cambiaste el nombre, `db` para que apunten a **tu propia base de datos**.

### Instalar dependencias del backend

En consola, desde la carpeta `eventhub_backend`:

```bash
cd eventhub_backend
dart pub get
```

### Levantar el servidor backend

Desde la misma carpeta `eventhub_backend`:

```bash
dart run bin/server.dart
```

El servidor quedará escuchando en `http://localhost:8080`.

---

## 4. Configurar y levantar el frontend (React + Vite)

El frontend está en:
- `eventhub_frontend/eventhub`

### Instalar dependencias del frontend

En consola:

```bash
cd eventhub_frontend/eventhub
npm install
```

### Levantar el frontend en modo desarrollo

Desde `eventhub_frontend/eventhub`:

```bash
npm run dev
```

Vite mostrará una URL (normalmente `http://localhost:5173`). Abre esa dirección en el navegador.

> Importante: el backend debe estar corriendo en `http://localhost:8080` para que el frontend pueda cargar los eventos y registrar usuarios.

---

## 5. Resumen rápido de comandos

```bash
# 1) Backend
cd eventhub_backend
dart pub get      # solo la primera vez
dart run bin/server.dart

# 2) Frontend
cd eventhub_frontend/eventhub
npm install       # solo la primera vez
npm run dev
```

Con esto deberías poder levantar toda la app con tu propia base de datos MySQL.