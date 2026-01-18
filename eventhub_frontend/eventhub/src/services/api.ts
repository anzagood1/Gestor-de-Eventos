// Tipos para el backend
export interface BackendEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  maxCapacity: number;
}

export interface EventsResponse {
  events: BackendEvent[];
}

export interface CreateEventResponse {
  message: string;
  id: number;
}

export interface RegisterResponse {
  message: string;
  registrationId: number;
}

export interface RegistrationsResponse {
  registrations: Array<{
    id: number;
    eventId: number;
    userName: string;
    registrationDate: string;
  }>;
}

const API_URL = 'http://localhost:8080/api';

export const apiService = {

  async getEvents(): Promise<BackendEvent[]> {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error("Error al cargar eventos");

    const data = await res.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (data && Array.isArray(data.events)) {
      return data.events;
    }

    throw new Error("Respuesta inválida del servidor de eventos");
  },

  async getEventRegistrations(eventId: number): Promise<number> {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}/registrations`);

      if (!response.ok) {
        return 0;
      }

      const data: RegistrationsResponse = await response.json();
      return data.registrations.length;
    } catch (error) {
      console.error('Error getting registrations:', error);
      return 0;
    }
  },

    async createEvent(eventData: {
      id: number;
      title: string;
      date: string;
      location: string;
      description: string;
      maxAttendees: number;
  }): Promise<CreateEventResponse> {
    try {
      const backendData: BackendEvent = {
        id: eventData.id,
        title: eventData.title,
        description: eventData.description,
        eventDate: eventData.date,
        location: eventData.location,
        maxCapacity: eventData.maxAttendees,
      };

      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear evento');
      }

      const data: CreateEventResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async registerToEvent(eventId: number, userName: string): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId,
          userName: userName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrarse');
      }

      const data: RegisterResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error registering to event:', error);
      throw error;
    }
  },
};
    