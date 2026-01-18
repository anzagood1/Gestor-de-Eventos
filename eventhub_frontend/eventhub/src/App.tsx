import { useState, useEffect } from 'react';
import { Plus, Calendar, Filter, LogOut, RefreshCw} from 'lucide-react';
import { CreateEventModal } from './components/CreateEventModal';
import { EventList } from './components/EventList';
import { WelcomeScreen } from './components/WelcomeScreen';
import { toast, Toaster } from 'sonner';
import { apiService } from './services/api';
import type { BackendEvent } from './services/api';

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
  const [events, setEvents] = useState<Event[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterView, setFilterView] = useState<'all' | 'registered'>('all');

  const [loading, setLoading] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedUser = localStorage.getItem('eventhub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadEvents();
      const saved = localStorage.getItem(`registrations_${user.email}`);
      if (saved) {
        setRegisteredEvents(new Set(JSON.parse(saved)));
      }
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      
      const backendEvents = await apiService.getEvents();

      const formattedEvents: Event[] = await Promise.all(
        backendEvents.map(async (event: BackendEvent) => {
          const currentAttendees = event.id 
            ? await apiService.getEventRegistrations(event.id)
            : 0;

          const eventId = event.id?.toString() || '';

          return {
            id: eventId,
            title: event.title,
            date: event.eventDate,
            location: event.location,
            description: event.description,
            maxAttendees: event.maxCapacity,
            currentAttendees: currentAttendees,
            isRegistered: registeredEvents.has(eventId),
          };
        })
      );
      setEvents(formattedEvents);
    } catch (err) {
      toast.error('No se pudieron cargar los eventos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: {
    id: number;
    title: string;
    date: string;
    location: string;
    description: string;
    maxAttendees: number;
  }) => {
    try {
      await apiService.createEvent(eventData);
      toast.success('¡Evento creado exitosamente!');
      await loadEvents();
    } catch (err: any) {
      toast.error(err.message || 'Error al crear el evento');
      console.error(err);
    }
  };

    const handleRegister = async (eventId: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }

    try {
      await apiService.registerToEvent(parseInt(eventId), user.name);
      
      const newRegisteredEvents = new Set(registeredEvents).add(eventId);
      setRegisteredEvents(newRegisteredEvents);
      
      localStorage.setItem(
        `registrations_${user.email}`,
        JSON.stringify([...newRegisteredEvents])
      );
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId
            ? { 
                ...event, 
                currentAttendees: event.currentAttendees + 1, 
                isRegistered: true 
              }
            : event
        )
      );

      toast.success(`¡Te has inscrito a "${events.find(e => e.id === eventId)?.title}"!`);
    } catch (err: any) {
      toast.error(err.message || 'Error al registrarse');
      console.error(err);
    }
  };

  const filteredEvents = filterView === 'all' 
    ? events 
    : events.filter(event => event.isRegistered);

  const registeredCount = events.filter(e => e.isRegistered).length;

  const handleLogin = (email: string, name: string) => {
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('eventhub_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setEvents([]); 
    setRegisteredEvents(new Set()); 
    localStorage.removeItem('eventhub_user'); 
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
                onClick={loadEvents}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Cargando eventos...</p>
          </div>
        ) : (
          <EventList events={filteredEvents} onRegister={handleRegister} />
        )}
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