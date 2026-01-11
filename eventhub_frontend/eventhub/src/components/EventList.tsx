import { EventCard } from './EventCard';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  maxAttendees: number;
  currentAttendees: number;
  isRegistered: boolean;
}

interface EventListProps {
  events: Event[];
  onRegister: (eventId: string) => void;
}

export function EventList({ events, onRegister }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay eventos disponibles en este momento.</p>
        <p className="text-gray-400 text-sm mt-2">¡Crea el primer evento!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onRegister={onRegister} />
      ))}
    </div>
  );
}
