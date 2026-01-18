export async function getEvents() {
  const res = await fetch("http://localhost:8080/events");

  if (!res.ok) {
    throw new Error("Error cargando eventos");
  }

  return await res.json();
}