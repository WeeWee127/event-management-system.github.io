import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../components/EventList';
import { Database } from '../lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEdit = (event: Event) => {
    navigate(`/edit-event/${event.id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <p className="mt-2 text-gray-600">Manage the events you've created.</p>
      </div>
      <EventList onEdit={handleEdit} myEventsOnly={true} />
    </div>
  );
}