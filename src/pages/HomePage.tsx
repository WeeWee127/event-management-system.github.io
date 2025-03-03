import React from 'react';
import EventList from '../components/EventList';

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="mt-2 text-gray-600">Discover and register for events happening near you.</p>
      </div>
      <EventList />
    </div>
  );
}