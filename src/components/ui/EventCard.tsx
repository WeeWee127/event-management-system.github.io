import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTag, FaClock } from 'react-icons/fa';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  imageUrl?: string;
  tags?: Array<{ name: string }>;
  price?: number | null;
  isPrivate?: boolean;
  registrationDeadline?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  maxParticipants,
  imageUrl,
  tags,
  price,
  isPrivate,
  registrationDeadline
}) => {
  // Перевіряємо, чи дедлайн реєстрації ще не минув
  const isRegistrationOpen = registrationDeadline 
    ? new Date(registrationDeadline) > new Date() 
    : true;
  
  // Перевіряємо, чи подія ще не відбулася
  const isPastEvent = new Date(date) < new Date();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
      {/* Верхня частина картки з зображенням */}
      <div className="relative h-48 overflow-hidden">
        <img 
          className="w-full h-full object-cover" 
          src={imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3'} 
          alt={title} 
        />
        
        {/* Статусні бейджі */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isPrivate && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-md">
              Приватна
            </span>
          )}
          
          {isPastEvent ? (
            <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-md">
              Завершена
            </span>
          ) : !isRegistrationOpen ? (
            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-md">
              Реєстрацію закрито
            </span>
          ) : (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-md">
              Відкрита
            </span>
          )}
          
          {price !== null && price !== undefined && price > 0 ? (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md">
              {price} грн
            </span>
          ) : (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-md">
              Безкоштовно
            </span>
          )}
        </div>
      </div>
      
      {/* Основний контент картки */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="mr-2 text-indigo-600" />
            <span className="text-sm">
              {new Date(date).toLocaleDateString('uk-UA', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="mr-2 text-indigo-600" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <FaUsers className="mr-2 text-indigo-600" />
            <span className="text-sm">До {maxParticipants} учасників</span>
          </div>
          
          {registrationDeadline && (
            <div className="flex items-center text-gray-700">
              <FaClock className="mr-2 text-indigo-600" />
              <span className="text-sm">Реєстрація до {new Date(registrationDeadline).toLocaleDateString('uk-UA')}</span>
            </div>
          )}
        </div>
        
        {/* Теги */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-800"
              >
                <FaTag className="mr-1 text-indigo-600" />
                {tag.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Кнопка деталей */}
        <Link 
          to={`/event/${id}`}
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors"
        >
          Дізнатися більше
        </Link>
      </div>
    </div>
  );
};

export default EventCard; 