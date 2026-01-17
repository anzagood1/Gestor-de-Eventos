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