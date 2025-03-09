import React, { useState } from 'react';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';

export interface EventFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onSearch: (query: string) => void;
}

export interface FilterState {
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  isPrivate?: boolean;
  maxPrice?: number;
}

const EventFilters: React.FC<EventFiltersProps> = ({ 
  onFilterChange, 
  onSortChange,
  onSearch 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const handleFilterChange = (field: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleSortChange = (field: string) => {
    // Якщо вибрано те ж поле - міняємо порядок, інакше - встановлюємо нове поле із порядком asc
    const newOrder = field === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setSortBy(field);
    onSortChange(field, newOrder);
  };
  
  const handleReset = () => {
    setFilters({});
    setSortBy('date');
    setSortOrder('asc');
    setSearchQuery('');
    onFilterChange({});
    onSortChange('date', 'asc');
    onSearch('');
  };
  
  const handleSearch = () => {
    onSearch(searchQuery);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
          >
            <FaFilter className="mr-2" />
            Фільтри
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
              onClick={() => handleSortChange(sortBy)}
            >
              <FaSort className="mr-2" />
              Сортувати: {sortBy === 'date' ? 'за датою' : sortBy === 'title' ? 'за назвою' : 'за популярністю'}
              {sortOrder === 'asc' ? ' ↑' : ' ↓'}
            </button>
            <div className="absolute z-10 mt-1 hidden group-hover:block bg-white rounded-md shadow-lg w-48">
              <div className="py-1">
                <button 
                  onClick={() => handleSortChange('date')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  За датою
                </button>
                <button 
                  onClick={() => handleSortChange('title')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  За назвою
                </button>
                <button 
                  onClick={() => handleSortChange('popularity')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  За популярністю
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук подій..."
              className="border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Локація
              </label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Введіть місце проведення"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата початку
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата кінця
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Максимальна ціна
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Введіть макс. ціну"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="private"
                type="checkbox"
                checked={!!filters.isPrivate}
                onChange={(e) => handleFilterChange('isPrivate', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="private" className="ml-2 block text-sm text-gray-900">
                Тільки приватні події
              </label>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="mr-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
            >
              Скинути
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Застосувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters; 