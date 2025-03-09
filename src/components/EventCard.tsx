import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaLock, FaMoneyBillWave } from 'react-icons/fa';
import { EventType } from './EventList';

interface EventCardProps {
  event: EventType;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Перевірка статусу події
  const isEventPassed = new Date(event.end_date || event.start_date) < new Date();
  
  // Форматування дати
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };

  // Визначення статусу події
  const getEventStatus = () => {
    if (isEventPassed) {
      return { label: 'Закінчилась', className: 'bg-gray-500' };
    }
    if (event.is_private) {
      return { label: 'Приватна', className: 'bg-purple-600' };
    }
    return { label: 'Відкрита', className: 'bg-green-600' };
  };

  // Визначення ціни
  const getPriceLabel = () => {
    if (event.price === 0) {
      return { label: 'Безкоштовно', className: 'bg-teal-600' };
    }
    return { 
      label: `${event.price} грн`, 
      className: 'bg-blue-600' 
    };
  };

  const status = getEventStatus();
  const priceLabel = getPriceLabel();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ 
          backgroundImage: event.image_url 
            ? `url(${event.image_url})` 
            : 'url(https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80)'
        }}
      >
        {/* Статус події та ціна */}
        <div className="absolute top-0 right-0 p-2 flex flex-col gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded text-white ${status.className}`}>
            {status.label}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded text-white ${priceLabel.className}`}>
            {priceLabel.label}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 hover:text-indigo-600 transition-colors">
          {event.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2 text-indigo-600" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-indigo-600" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FaUsers className="mr-2 text-indigo-600" />
            <span>До {event.max_attendees} учасників</span>
          </div>
          
          {event.is_private && (
            <div className="flex items-center text-gray-600">
              <FaLock className="mr-2 text-indigo-600" />
              <span>Приватна подія</span>
            </div>
          )}
          
          {event.price > 0 && (
            <div className="flex items-center text-gray-600">
              <FaMoneyBillWave className="mr-2 text-indigo-600" />
              <span>{event.price} грн</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <Link 
          to={`/event/${event.id}`}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Дізнатись більше
        </Link>
      </div>
    </div>
  );
};

export default EventCard; 