import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { supabase, getSupabaseEnvVars } from '../../lib/supabase';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

// Явно визначаємо тип даних
interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location: string;
  max_attendees: number;
  image_url?: string;
}

// Мок-дані для тестування компонента
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Конференція Web Development 2024',
    description: 'Щорічна конференція з веб-розробки з відомими спікерами та майстер-класами.',
    start_date: new Date(2024, 5, 15).toISOString(),
    location: 'Київ, Україна',
    max_attendees: 300,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
  },
  {
    id: '2',
    title: 'JavaScript Workshop',
    description: 'Практичний воркшоп з сучасного JavaScript та фреймворків.',
    start_date: new Date(2024, 6, 10).toISOString(),
    location: 'Львів, Україна',
    max_attendees: 50,
    image_url: 'https://images.unsplash.com/photo-1561726223-741b511d3203'
  },
  {
    id: '3',
    title: 'DevOps Meetup',
    description: 'Зустріч спеціалістів з DevOps для обміну досвідом та нетворкінгу.',
    start_date: new Date(2024, 5, 25).toISOString(),
    location: 'Харків, Україна',
    max_attendees: 100,
    image_url: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9'
  }
];

const EventCarousel: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('EventCarousel: Спроба підключення до Supabase...');
        console.log('EventCarousel: Змінні середовища Supabase:', getSupabaseEnvVars());
        
        // Захисний код для перехоплення помилок liveAnalysis.js
        try {
          // Це заглушка для перехоплення помилок від зовнішнього liveAnalysis.js
          const globalAny = window as any;
          if (globalAny.liveAnalysisData && typeof globalAny.liveAnalysisData.data === 'undefined') {
            globalAny.liveAnalysisData.data = []; // Встановлюємо порожній масив
          }
        } catch (err) {
          console.warn('Виникла помилка при доступі до liveAnalysis.js:', err);
        }
        
        // Спочатку пробуємо отримати дані з Supabase
        let supabaseResponse;
        try {
          supabaseResponse = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        } catch (supabaseError) {
          console.error('Помилка при виконанні запиту до Supabase:', supabaseError);
          throw supabaseError;
        }
        
        const { data, error } = supabaseResponse || { data: null, error: new Error('Помилка отримання даних') };

        console.log('EventCarousel: Відповідь от Supabase:', { 
          dataReceived: !!data, 
          dataLength: data?.length || 0, 
          error: error ? JSON.stringify(error) : 'немає'
        });

        if (error) {
          console.warn('Помилка при отриманні даних з Supabase, використовуємо мок-дані:', error);
          setUseMockData(true);
          setFeaturedEvents(mockEvents);
          return;
        }
        
        // Перевіряємо, чи отримали дані
        if (!data || data.length === 0) {
          console.log('EventCarousel: Не отримано даних або порожній масив, використовуємо мок-дані');
          setUseMockData(true);
          setFeaturedEvents(mockEvents);
          return;
        }
        
        // Додаткова перевірка, що дані відповідають очікуваній структурі
        const validEvents = data.filter(event => 
          event && 
          typeof event.id === 'string' && 
          typeof event.title === 'string' && 
          typeof event.start_date === 'string'
        );
        
        if (validEvents.length === 0) {
          console.warn('EventCarousel: Отримані дані не відповідають очікуваній структурі, використовуємо мок-дані');
          setUseMockData(true);
          setFeaturedEvents(mockEvents);
          return;
        }
        
        setFeaturedEvents(validEvents);
        console.log('EventCarousel: Успішно оновлено стан з даними:', validEvents.length);
      } catch (error) {
        console.error('Error fetching featured events:', error);
        console.log('EventCarousel: Помилка, використовуємо мок-дані замість Supabase');
        setUseMockData(true);
        setFeaturedEvents(mockEvents);
        setError(null); // скидаємо помилку, оскільки ми використовуємо мок-дані
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg">
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">Завантаження популярних подій...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 bg-red-100 rounded-lg">
        <div className="flex items-center justify-center h-full">
          <span className="text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  if (!Array.isArray(featuredEvents) || featuredEvents.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">Немає популярних подій для показу</span>
        </div>
      </div>
    );
  }

  return (
    <div className="event-carousel-container mb-8">
      <h2 className="text-2xl font-bold mb-4">
        Популярні події {useMockData && <span className="text-sm font-normal text-gray-500">(тестові дані)</span>}
      </h2>
      <div className="carousel-wrapper rounded-lg overflow-hidden shadow-lg">
        <Slider {...settings}>
          {featuredEvents.map((event) => (
            <div key={event.id} className="carousel-slide">
              <div 
                className="relative h-96 bg-cover bg-center"
                style={{ 
                  backgroundImage: event.image_url 
                    ? `url(${event.image_url})` 
                    : 'url(https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80)'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
                  <h3 className="text-white text-3xl font-bold mb-2">{event.title}</h3>
                  <p className="text-white text-lg mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-white">
                      <FaCalendarAlt className="mr-2" />
                      <span>{new Date(event.start_date).toLocaleDateString('uk-UA', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-white">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-white">
                      <FaUsers className="mr-2" />
                      <span>До {event.max_attendees} учасників</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/event/${event.id}`}
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
                  >
                    Дізнатися більше
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EventCarousel; 