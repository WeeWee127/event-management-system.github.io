import React from 'react';
import { FaUser, FaEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';

const UserProfile: React.FC = () => {
  // Заглушка даних користувача
  const userProfile = {
    name: 'Демо Користувач',
    email: 'user@example.com',
    avatar: null,
    registeredAt: new Date(2023, 0, 15).toISOString(),
    eventsCreated: 5,
    eventsAttending: 3
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Профіль користувача</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Панель профілю */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1">
            <div className="flex flex-col items-center text-center mb-6">
              {userProfile.avatar ? (
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <FaUser className="text-indigo-600 text-5xl" />
                </div>
              )}
              
              <h2 className="text-xl font-semibold">{userProfile.name}</h2>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Учасник з {new Date(userProfile.registeredAt).toLocaleDateString('uk-UA')}
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <FaEdit className="mr-2 text-indigo-600" />
                Редагувати профіль
              </button>
              
              <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <FaKey className="mr-2 text-indigo-600" />
                Змінити пароль
              </button>
              
              <button className="flex items-center justify-center py-2 px-4 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200">
                <FaSignOutAlt className="mr-2" />
                Вийти
              </button>
            </div>
          </div>
          
          {/* Статистика та події */}
          <div className="md:col-span-2">
            {/* Статистика */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Активність</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-indigo-600">{userProfile.eventsCreated}</p>
                  <p className="text-gray-700">Створено подій</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{userProfile.eventsAttending}</p>
                  <p className="text-gray-700">Відвідуваних подій</p>
                </div>
              </div>
            </div>
            
            {/* Закладки для різних типів подій */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b">
                <div className="flex">
                  <button className="px-4 py-3 border-b-2 border-indigo-600 text-indigo-600 font-medium">
                    Мої події
                  </button>
                  <button className="px-4 py-3 text-gray-600 hover:text-indigo-600 font-medium">
                    Зареєстровані події
                  </button>
                  <button className="px-4 py-3 text-gray-600 hover:text-indigo-600 font-medium">
                    Минулі події
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {userProfile.eventsCreated > 0 ? (
                  <div className="space-y-4">
                    {/* Приклад події */}
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">Демо подія #1</h4>
                          <p className="text-gray-600 text-sm">
                            20 травня 2023 • Київ, Україна
                          </p>
                        </div>
                        <div className="text-sm font-medium text-indigo-600">
                          Активна
                        </div>
                      </div>
                    </div>
                    
                    {/* Приклад події */}
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">Демо подія #2</h4>
                          <p className="text-gray-600 text-sm">
                            15 червня 2023 • Львів, Україна
                          </p>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          Запланована
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">У вас ще немає створених подій</p>
                    <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                      Створити подію
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 