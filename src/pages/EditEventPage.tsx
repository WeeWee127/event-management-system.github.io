import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from '../components/EventForm';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setEvent(data);
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

    fetchEvent();
  }, [id]);

  const handleSuccess = () => {
    navigate('/my-events');
  };

  if (loading) return <div className="text-center py-10">Loading event...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!event) return <div className="text-center py-10 text-red-600">Event not found</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="mt-2 text-gray-600">Update your event details below.</p>
      </div>
      <EventForm event={event} onSuccess={handleSuccess} />
    </div>
  );
}