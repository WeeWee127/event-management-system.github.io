import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Edit, Trash2, UserCheck } from 'lucide-react';
import { supabase, getSupabaseEnvVars } from '../lib/supabase';
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

// Мок-дані для відображення, якщо Supabase не відповідає
const mockEvents: EventType[] = [
  {
    id: '1',
    title: 'Конференція Web Development 2024',
    description: 'Щорічна конференція з веб-розробки з відомими спікерами та майстер-класами.',
    start_date: new Date(2024, 5, 15).toISOString(),
    end_date: new Date(2024, 5, 17).toISOString(),
    location: 'Київ, Україна',
    event_type: 'conference',
    is_private: false,
    price: 1500,
    max_attendees: 300,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    created_at: new Date(2024, 3, 10).toISOString()
  },
  {
    id: '2',
    title: 'JavaScript Workshop',
    description: 'Практичний воркшоп з сучасного JavaScript та фреймворків.',
    start_date: new Date(2024, 6, 10).toISOString(),
    location: 'Львів, Україна',
    event_type: 'workshop',
    is_private: false,
    price: 800,
    max_attendees: 50,
    image_url: 'https://images.unsplash.com/photo-1561726223-741b511d3203',
    created_at: new Date(2024, 4, 5).toISOString()
  },
  {
    id: '3',
    title: 'DevOps Meetup',
    description: 'Зустріч спеціалістів з DevOps для обміну досвідом та нетворкінгу.',
    start_date: new Date(2024, 5, 25).toISOString(),
    location: 'Харків, Україна',
    event_type: 'meetup',
    is_private: false,
    price: 0,
    max_attendees: 100,
    image_url: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9',
    created_at: new Date(2024, 4, 15).toISOString()
  },
  {
    id: '4',
    title: 'React Advanced',
    description: 'Поглиблений курс з React, Redux та TypeScript для досвідчених розробників.',
    start_date: new Date(2024, 7, 5).toISOString(),
    end_date: new Date(2024, 7, 7).toISOString(),
    location: 'Одеса, Україна',
    event_type: 'workshop',
    is_private: true,
    price: 2000,
    max_attendees: 30,
    image_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
    created_at: new Date(2024, 5, 1).toISOString()
  },
  {
    id: '5',
    title: 'IT Security Conference',
    description: 'Конференція з кібербезпеки та захисту даних.',
    start_date: new Date(2024, 8, 10).toISOString(),
    end_date: new Date(2024, 8, 12).toISOString(),
    location: 'Київ, Україна',
    event_type: 'conference',
    is_private: false,
    price: 1200,
    max_attendees: 200,
    image_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7',
    created_at: new Date(2024, 6, 1).toISOString()
  },
  {
    id: '6',
    title: 'UX/UI Design Workshop',
    description: 'Практичний воркшоп з дизайну інтерфейсів та користувацького досвіду.',
    start_date: new Date(2024, 6, 20).toISOString(),
    location: 'Дніпро, Україна',
    event_type: 'workshop',
    is_private: false,
    price: 500,
    max_attendees: 40,
    image_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c',
    created_at: new Date(2024, 5, 20).toISOString()
  },
  {
    id: '7',
    title: 'Networking Party для IT-спеціалістів',
    description: 'Неформальна зустріч для нетворкінгу та знайомства з колегами з IT-індустрії.',
    start_date: new Date(2024, 6, 30).toISOString(),
    location: 'Львів, Україна',
    event_type: 'meetup',
    is_private: false,
    price: 200,
    max_attendees: 150,
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    created_at: new Date(2024, 5, 25).toISOString()
  },
  {
    id: '8',
    title: 'Data Science Summit',
    description: 'Саміт зі штучного інтелекту, машинного навчання та аналізу даних.',
    start_date: new Date(2024, 9, 15).toISOString(),
    end_date: new Date(2024, 9, 17).toISOString(),
    location: 'Київ, Україна',
    event_type: 'conference',
    is_private: false,
    price: 1800,
    max_attendees: 250,
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    created_at: new Date(2024, 7, 10).toISOString()
  }
];

const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [useMockData, setUseMockData] = useState(false);
  
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
      
      console.log('EventList: Спроба підключення до Supabase...');
      console.log('EventList: Змінні середовища Supabase:', getSupabaseEnvVars());
      
      let { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('EventList: Відповідь от Supabase:', { 
        dataReceived: !!data, 
        dataLength: data?.length || 0, 
        error: error ? JSON.stringify(error) : 'немає'
      });

      if (error) {
        console.warn('EventList: Помилка при отриманні даних з Supabase, використовуємо мок-дані:', error);
        setUseMockData(true);
        setEvents(mockEvents);
        return;
      }

      // Перевіряємо, чи отримали дані
      if (!data || data.length === 0) {
        console.log('EventList: Не отримано даних або порожній масив, використовуємо мок-дані');
        setUseMockData(true);
        setEvents(mockEvents);
        return;
      }

      console.log('EventList: Отримані дані подій:', data.length);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      console.log('EventList: Помилка, використовуємо мок-дані замість Supabase');
      setUseMockData(true);
      setEvents(mockEvents);
      setError(null); // скидаємо помилку, оскільки ми використовуємо мок-дані
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
        <h1 className="text-3xl font-bold mb-6">
          Усі події {useMockData && <span className="text-sm font-normal text-gray-500">(тестові дані)</span>}
        </h1>
        
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