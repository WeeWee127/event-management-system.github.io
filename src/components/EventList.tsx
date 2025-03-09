import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Edit, Trash2, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import RegistrationsList from './RegistrationsList';
import EventCard from './EventCard';
import EventCarousel from './ui/EventCarousel';
import EventFilters, { FilterState } from './ui/EventFilters';
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import Pagination from './ui/Pagination';

export interface EventType {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location: string;
  event_type: string;
  is_private: boolean;
  price: number;
  max_attendees: number;
  image_url?: string;
  created_at: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  
  // Фільтри
  const [filters, setFilters] = useState<FilterState>({
    eventType: 'all',
    dateRange: 'all',
    isPrivate: 'all',
    price: 'all',
    location: 'all'
  });

  // Сортування
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError(null);
      
      let { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Перевіряємо, чи отримали дані
      if (!data) {
        setEvents([]);
        return;
      }

      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Помилка завантаження подій. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  }

  // Фільтрація подій
  const filteredEvents = events.filter(event => {
    // Пошук
    const matchesSearch = 
      searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Тип події
    const matchesType = 
      filters.eventType === 'all' || 
      event.event_type === filters.eventType;

    // Дата
    let matchesDate = true;
    const eventDate = new Date(event.start_date);
    const now = new Date();
    
    if (filters.dateRange === 'today') {
      matchesDate = eventDate.toDateString() === now.toDateString();
    } else if (filters.dateRange === 'this-week') {
      const weekEnd = new Date();
      weekEnd.setDate(now.getDate() + 7);
      matchesDate = eventDate >= now && eventDate <= weekEnd;
    } else if (filters.dateRange === 'this-month') {
      const monthEnd = new Date();
      monthEnd.setMonth(now.getMonth() + 1);
      matchesDate = eventDate >= now && eventDate <= monthEnd;
    }

    // Приватність
    const matchesPrivacy = 
      filters.isPrivate === 'all' || 
      (filters.isPrivate === 'private' && event.is_private) ||
      (filters.isPrivate === 'public' && !event.is_private);

    // Ціна
    let matchesPrice = true;
    if (filters.price === 'free') {
      matchesPrice = event.price === 0;
    } else if (filters.price === 'paid') {
      matchesPrice = event.price > 0;
    }

    // Локація
    const matchesLocation = 
      filters.location === 'all' || 
      event.location === filters.location;

    return matchesSearch && matchesType && matchesDate && matchesPrivacy && matchesPrice && matchesLocation;
  });

  // Сортування подій
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date-asc') {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    } else if (sortBy === 'date-desc') {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    } else if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'title-desc') {
      return b.title.localeCompare(a.title);
    } else if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  // Пагінація
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

  // Унікальні локації для фільтра
  const locations = Array.from(new Set(events.map(event => event.location)));

  // Обробники подій
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
              <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
              <div className="h-8 bg-gray-300 rounded-md mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded-md mb-4 w-2/3"></div>
              <div className="h-10 bg-gray-300 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-100 rounded-lg text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchEvents} 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EventCarousel />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Усі події</h1>
        
        {/* Пошук */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Пошук подій..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-3 px-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        {/* Фільтри та сортування */}
        <EventFilters 
          filters={filters} 
          sortBy={sortBy} 
          locations={locations}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </div>
      
      {/* Результати */}
      {sortedEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {/* Пагінація */}
          {sortedEvents.length > eventsPerPage && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-gray-600 text-lg">Подій, що відповідають критеріям пошуку, не знайдено.</p>
          {searchTerm || Object.values(filters).some(v => v !== 'all') ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  eventType: 'all',
                  dateRange: 'all',
                  isPrivate: 'all',
                  price: 'all',
                  location: 'all'
                });
              }}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Скинути фільтри
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EventList;