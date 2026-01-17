// Tipos para el backend
export interface BackendEvent {
  id?: number;
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
    try {
      const response = await fetch(`${API_URL}/events`);
      
      if (!response.ok) {
        throw new Error('Error al obtener eventos');
      }
      
      const data: EventsResponse = await response.json();
      return data.events;
    } catch (error) {
      console.error('Error getting events:', error);
      throw error;
    }
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
};
