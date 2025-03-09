import React from 'react';
import EventList from '../components/EventList';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Система управління подіями</h1>
      <EventList />
    </div>
  );
};

export default HomePage;