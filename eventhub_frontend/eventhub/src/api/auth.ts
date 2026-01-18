const API_URL = "http://127.0.0.1:8080/api";

export interface AuthResponse {
  id: number;
  userName: string;
  email: string;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al iniciar sesión");
  }

  return res.json();
}

export async function register(
  userName: string,
  email: string,
  password: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al registrar");
  }

  return res.json();
}
