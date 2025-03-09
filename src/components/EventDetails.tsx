import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Заглушка даних події для демонстрації
  const eventData = {
    id: id || '1',
    title: 'Демо подія',
    description: 'Це демонстраційна подія для показу деталей. В реальному додатку тут було б отримання реальних даних з Supabase.',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 86400000).toISOString(), // +1 день
    location: 'Київ, Україна',
    event_type: 'conference',
    is_private: false,
    price: 0,
    max_attendees: 100,
    image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <FaArrowLeft className="mr-2" />
        Назад до списку подій
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div 
          className="h-80 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${eventData.image_url})` 
          }}
        >
          <div className="h-full w-full bg-black bg-opacity-50 flex flex-col justify-end p-6">
            <h1 className="text-4xl font-bold text-white mb-2">{eventData.title}</h1>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center text-gray-700">
              <FaCalendarAlt className="mr-2 text-indigo-600" />
              <span>
                {new Date(eventData.start_date).toLocaleDateString('uk-UA', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <FaClock className="mr-2 text-indigo-600" />
              <span>
                {new Date(eventData.start_date).toLocaleTimeString('uk-UA', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-indigo-600" />
              <span>{eventData.location}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <FaUsers className="mr-2 text-indigo-600" />
              <span>До {eventData.max_attendees} учасників</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <FaMoneyBillWave className="mr-2 text-indigo-600" />
              <span>{eventData.price > 0 ? `${eventData.price} грн` : 'Безкоштовно'}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Про подію</h2>
            <p className="text-gray-700">{eventData.description}</p>
          </div>
          
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
          >
            Зареєструватися на подію
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 