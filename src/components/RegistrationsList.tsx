import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Registration {
  id: string;
  created_at: string;
  event_id: string;
  user_id: string;
  status: string;
  profiles: {
    full_name: string;
  };
}

interface RegistrationsListProps {
  eventId: string;
}

export default function RegistrationsList({ eventId }: RegistrationsListProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', registrationId);

      if (error) throw error;
      
      // Оновлюємо локальний стан
      setRegistrations(registrations.map(reg => 
        reg.id === registrationId ? { ...reg, status: newStatus } : reg
      ));
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error updating status: ${error.message}`);
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading registrations...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  if (registrations.length === 0) {
    return <div className="text-center py-4 text-gray-500">No registrations yet.</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Registrations</h3>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Participant
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                  {registration.profiles.full_name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    registration.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : registration.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {registration.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  {registration.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(registration.id, 'confirmed')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(registration.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
