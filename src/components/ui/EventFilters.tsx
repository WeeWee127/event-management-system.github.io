import React from 'react';
import { FaFilter, FaSort } from 'react-icons/fa';

export interface FilterState {
  eventType: string;
  dateRange: string;
  isPrivate: string;
  price: string;
  location: string;
}

interface EventFiltersProps {
  filters: FilterState;
  sortBy: string;
  locations: string[];
  onFilterChange: (filterName: string, value: string) => void;
  onSortChange: (value: string) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  sortBy,
  locations,
  onFilterChange,
  onSortChange
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="flex items-center mb-4">
        <FaFilter className="text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Фільтри</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Тип події */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
            Тип події
          </label>
          <select
            id="eventType"
            value={filters.eventType}
            onChange={(e) => onFilterChange('eventType', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">Усі типи</option>
            <option value="conference">Конференція</option>
            <option value="workshop">Майстер-клас</option>
            <option value="meetup">Зустріч</option>
            <option value="concert">Концерт</option>
            <option value="exhibition">Виставка</option>
          </select>
        </div>

        {/* Дата */}
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
            Дата
          </label>
          <select
            id="dateRange"
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">Усі дати</option>
            <option value="today">Сьогодні</option>
            <option value="this-week">Цього тижня</option>
            <option value="this-month">Цього місяця</option>
          </select>
        </div>

        {/* Приватність */}
        <div>
          <label htmlFor="isPrivate" className="block text-sm font-medium text-gray-700 mb-1">
            Доступність
          </label>
          <select
            id="isPrivate"
            value={filters.isPrivate}
            onChange={(e) => onFilterChange('isPrivate', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">Усі події</option>
            <option value="public">Публічні</option>
            <option value="private">Приватні</option>
          </select>
        </div>

        {/* Ціна */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Ціна
          </label>
          <select
            id="price"
            value={filters.price}
            onChange={(e) => onFilterChange('price', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">Будь-яка ціна</option>
            <option value="free">Безкоштовно</option>
            <option value="paid">Платно</option>
          </select>
        </div>

        {/* Локація */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Локація
          </label>
          <select
            id="location"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">Усі локації</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Сортування */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center mb-2">
          <FaSort className="text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Сортування</h3>
        </div>

        <div>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="date-desc">Дата (найновіші спочатку)</option>
            <option value="date-asc">Дата (найстаріші спочатку)</option>
            <option value="title-asc">Назва (А-Я)</option>
            <option value="title-desc">Назва (Я-А)</option>
            <option value="price-asc">Ціна (від найнижчої)</option>
            <option value="price-desc">Ціна (від найвищої)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilters; 