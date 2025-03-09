import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Створюємо масив сторінок для відображення
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    
    // Показуємо максимум 5 номерів сторінок
    if (totalPages <= 5) {
      // Якщо всього 5 або менше сторінок, показуємо всі
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Якщо більше 5 сторінок, показуємо поточну та по 2 з кожного боку
      // або більше з одного боку, якщо з іншого не вистачає
      if (currentPage <= 3) {
        // Ближче до початку
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Ближче до кінця
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Десь посередині
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
        {/* Кнопка "Попередня" */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Попередня
        </button>
        
        {/* Номери сторінок */}
        {getPageNumbers().map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
              currentPage === number
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}
        
        {/* Кнопка "Наступна" */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Наступна
        </button>
      </nav>
    </div>
  );
};

export default Pagination; 