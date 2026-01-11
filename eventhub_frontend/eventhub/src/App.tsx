import { useState } from 'react';
import { Plus, Calendar, Filter, LogOut } from 'lucide-react';
import { CreateEventModal } from './components/CreateEventModal';
import { EventList } from './components/EventList';
import { WelcomeScreen } from './components/WelcomeScreen';
import { toast, Toaster } from 'sonner';

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

export default function App() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Conferencia de Tecnología 2025',
      date: '2025-12-20T10:00',
      location: 'Centro de Convenciones',
      description: 'La mayor conferencia de tecnología del año. Speakers internacionales y networking.',
      maxAttendees: 200,
      currentAttendees: 145,
      isRegistered: false,
    },
    {
      id: '2',
      title: 'Workshop de Desarrollo Web',
      date: '2025-12-18T14:00',
      location: 'Campus Universitario',
      description: 'Aprende las últimas tecnologías web con expertos de la industria.',
      maxAttendees: 50,
      currentAttendees: 32,
      isRegistered: false,
    },
    {
      id: '3',
      title: 'Meetup de Emprendedores',
      date: '2025-12-22T18:00',
      location: 'Coworking Space Downtown',
      description: 'Conecta con otros emprendedores, comparte ideas y encuentra colaboradores.',
      maxAttendees: 30,
      currentAttendees: 28,
      isRegistered: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterView, setFilterView] = useState<'all' | 'registered'>('all');

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'currentAttendees' | 'isRegistered'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      currentAttendees: 0,
      isRegistered: false,
    };
    setEvents([newEvent, ...events]);
    toast.success('¡Evento creado exitosamente!');
  };

  const handleRegister = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId && !event.isRegistered && event.currentAttendees < event.maxAttendees) {
        toast.success(`¡Te has inscrito a "${event.title}"!`);
        return {
          ...event,
          currentAttendees: event.currentAttendees + 1,
          isRegistered: true,
        };
      }
      return event;
    }));
  };

  const filteredEvents = filterView === 'all' 
    ? events 
    : events.filter(event => event.isRegistered);

  const registeredCount = events.filter(e => e.isRegistered).length;

  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
  };

  const handleLogout = () => {
    setUser(null);
    toast.success('Sesión cerrada exitosamente');
  };

  // Show welcome screen if not logged in
  if (!user) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <WelcomeScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Organizador de Eventos</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Crear Evento
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Eventos</p>
                <p className="text-2xl mt-1 text-gray-900">{events.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mis Inscripciones</p>
                <p className="text-2xl mt-1 text-gray-900">{registeredCount}</p>
              </div>
              <Plus className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eventos Disponibles</p>
                <p className="text-2xl mt-1 text-gray-900">
                  {events.filter(e => !e.isRegistered && e.currentAttendees < e.maxAttendees).length}
                </p>
              </div>
              <Filter className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setFilterView('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filterView === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos los Eventos ({events.length})
          </button>
          <button
            onClick={() => setFilterView('registered')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filterView === 'registered'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Mis Inscripciones ({registeredCount})
          </button>
        </div>

        {/* Event List */}
        <EventList events={filteredEvents} onRegister={handleRegister} />
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
}