import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Edit, Trash2, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import RegistrationsList from './RegistrationsList';
import EventCard from './ui/EventCard';
import EventCarousel from './ui/EventCarousel';
import EventFilters, { FilterState } from './ui/EventFilters';
import { FaExclamationTriangle } from 'react-icons/fa';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_attendees: number | null;
  user_id: string;
  created_at: string;
  is_private?: boolean;
  registration_deadline?: string;
  price?: number | null;
  tags?: Array<{ name: string }>;
  image_url?: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 6;
  
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);
  
  useEffect(() => {
    // Застосовуємо фільтри, сортування та пошук до списку подій
    let filtered = [...events];
    
    // Фільтрація за пошуковим запитом
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    // Фільтрація за локацією
    if (filters.location) {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    // Фільтрація за датою
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(event => new Date(event.start_date) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Встановлюємо час на кінець дня
      filtered = filtered.filter(event => new Date(event.start_date) <= toDate);
    }
    
    // Фільтрація за приватністю
    if (filters.isPrivate !== undefined) {
      filtered = filtered.filter(event => 
        (event.is_private === filters.isPrivate)
      );
    }
    
    // Фільтрація за ціною
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(event => 
        event.price === null || event.price === undefined || event.price <= filters.maxPrice!
      );
    }
    
    // Сортування
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          : new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      } else if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else { // popularity - за кількістю max_attendees як приклад
        const aValue = a.max_attendees || 0; // Використовуємо 0, якщо значення null
        const bValue = b.max_attendees || 0;
        return sortOrder === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
    });
    
    setFilteredEvents(filtered);
    setTotalPages(Math.ceil(filtered.length / eventsPerPage));
    setCurrentPage(1); // Скидаємо на першу сторінку при зміні фільтрів
  }, [events, filters, sortBy, sortOrder, searchQuery]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) throw error;
      
      setEvents(data || []);
      setFilteredEvents(data || []);
      setTotalPages(Math.ceil((data?.length || 0) / eventsPerPage));
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Помилка завантаження подій. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Обчислюємо індекси для поточної сторінки
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  
  // Зміна сторінки
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Прокручуємо до верху сторінки
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-8">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Завантаження подій...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Карусель подій */}
      <EventCarousel />
      
      {/* Фільтри подій */}
      <EventFilters 
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
      />
      
      {/* Відображення помилки */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Показуємо к-сть знайдених подій */}
      <div className="mb-6 text-gray-600">
        Знайдено подій: {filteredEvents.length}
      </div>
      
      {/* Список подій */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">
            Не знайдено подій, що відповідають заданим критеріям
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={event.start_date}
                location={event.location}
                maxParticipants={event.max_attendees || 0}
                imageUrl={event.image_url}
                tags={event.tags}
                price={event.price}
                isPrivate={event.is_private}
                registrationDeadline={event.registration_deadline}
              />
            ))}
          </div>
          
          {/* Пагінація */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Попередня
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border border-gray-300 text-sm font-medium ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Наступна
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventList;