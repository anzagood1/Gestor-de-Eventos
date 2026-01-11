import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    maxAttendees: number;
    currentAttendees: number;
    isRegistered: boolean;
  };
  onRegister: (eventId: string) => void;
}

export function EventCard({ event, onRegister }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isEventPassed = eventDate < new Date();
  const isFull = event.currentAttendees >= event.maxAttendees;
  const availableSpots = event.maxAttendees - event.currentAttendees;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="pr-4">{event.title}</h3>
        {event.isRegistered && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm whitespace-nowrap">
            Inscrito
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-700">
          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-sm">
            {format(eventDate, "d 'de' MMMM, yyyy", { locale: es })}
          </span>
        </div>
        <div className="flex items-center text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-sm">
            {format(eventDate, 'HH:mm', { locale: es })} hrs
          </span>
        </div>
        <div className="flex items-center text-gray-700">
          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-sm">{event.location}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Users className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-sm">
            {event.currentAttendees} / {event.maxAttendees} inscritos
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm">
          {isFull ? (
            <span className="text-red-600">Cupo lleno</span>
          ) : (
            <span className="text-gray-600">
              {availableSpots} {availableSpots === 1 ? 'lugar disponible' : 'lugares disponibles'}
            </span>
          )}
        </div>
        <button
          onClick={() => onRegister(event.id)}
          disabled={event.isRegistered || isFull || isEventPassed}
          className={`px-4 py-2 rounded-lg transition-colors ${
            event.isRegistered
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isFull || isEventPassed
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {event.isRegistered
            ? 'Ya Inscrito'
            : isFull
            ? 'Lleno'
            : isEventPassed
            ? 'Finalizado'
            : 'Inscribirse'}
        </button>
      </div>
    </div>
  );
}
