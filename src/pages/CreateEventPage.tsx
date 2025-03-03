import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';

export default function CreateEventPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/my-events');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="mt-2 text-gray-600">Fill out the form below to create a new event.</p>
      </div>
      <EventForm onSuccess={handleSuccess} />
    </div>
  );
}