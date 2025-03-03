import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Edit, Trash2, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import RegistrationsList from './RegistrationsList';

type Event = Database['public']['Tables']['events']['Row'];

interface EventListProps {
  onEdit?: (event: Event) => void;
  myEventsOnly?: boolean;
}

export default function EventList({ onEdit, myEventsOnly = false }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let query = supabase.from('events').select('*');
        
        if (myEventsOnly && userId) {
          query = query.eq('user_id', userId);
        }
        
        const { data, error } = await query.order('start_date', { ascending: true });
        
        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [myEventsOnly, userId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!userId) {
      alert('Please sign in to register for events');
      return;
    }
    
    try {
      const { error } = await supabase.from('registrations').insert([
        { event_id: eventId, user_id: userId }
      ]);
      
      if (error) throw error;
      alert('You have successfully registered for this event!');
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading events...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (events.length === 0) return (
    <div className="text-center py-10 text-gray-500">
      {myEventsOnly ? 'You have not created any events yet.' : 'No events found.'}
    </div>
  );

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-4">{event.description}</p>
            
            <div className="flex flex-col space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {format(new Date(event.start_date), 'PPP')} at {format(new Date(event.start_date), 'p')} - 
                  {format(new Date(event.start_date), 'PP') !== format(new Date(event.end_date), 'PP') 
                    ? ` ${format(new Date(event.end_date), 'PPP')} at ` 
                    : ' '}
                  {format(new Date(event.end_date), 'p')}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
              {event.max_attendees && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Limited to {event.max_attendees} attendees</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              {event.user_id === userId ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit && onEdit(event)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedEventId(selectedEventId === event.id ? null : event.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    {selectedEventId === event.id ? 'Hide Registrations' : 'View Registrations'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRegister(event.id)}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Register
                </button>
              )}
            </div>
            
            {selectedEventId === event.id && (
              <RegistrationsList eventId={event.id} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}