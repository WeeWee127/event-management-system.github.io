import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { supabase } from '../supabaseClient';

// Схема валідації для тегів
const tagSchema = z.object({
  name: z.string().min(2, 'Тег має бути не менше 2 символів').max(20, 'Тег занадто довгий')
});

// Розширена схема валідації для події
const eventSchema = z.object({
  title: z.string()
    .min(3, 'Назва має бути не менше 3 символів')
    .max(100, 'Назва занадто довга')
    .refine((val) => !val.includes("@"), "Назва не може містити символ @"),
  
  description: z.string()
    .min(10, 'Опис має бути не менше 10 символів')
    .max(1000, 'Опис занадто довгий')
    .refine(
      (val) => val.split(' ').length >= 5,
      'Опис має містити щонайменше 5 слів'
    ),
  
  date: z.string()
    .refine(
      (date) => {
        const eventDate = new Date(date);
        const now = new Date();
        return eventDate > now;
      },
      'Дата має бути в майбутньому'
    )
    .refine(
      (date) => {
        const eventDate = new Date(date);
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        return eventDate <= maxDate;
      },
      'Дата не може бути більше ніж через рік'
    ),
  
  location: z.string()
    .min(3, 'Локація має бути не менше 3 символів')
    .max(100, 'Локація занадто довга'),
  
  maxParticipants: z.number()
    .min(1, 'Мінімальна кількість учасників - 1')
    .max(1000, 'Максимальна кількість учасників - 1000'),
  
  price: z.number()
    .min(0, 'Ціна не може бути від\'ємною')
    .max(100000, 'Ціна занадто велика')
    .nullable()
    .default(null),
  
  tags: z.array(tagSchema)
    .min(1, 'Додайте хоча б один тег')
    .max(5, 'Максимум 5 тегів'),
  
  isPrivate: z.boolean().default(false),
  
  registrationDeadline: z.string()
    .refine(
      (date, ctx) => {
        const deadlineDate = new Date(date);
        const eventDate = new Date(ctx.parent.date);
        return deadlineDate < eventDate;
      },
      'Дедлайн реєстрації має бути раніше дати події'
    )
});

type EventFormData = z.infer<typeof eventSchema>;

export default function CreateEventForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Array<{ name: string }>>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      tags: [],
      isPrivate: false,
      price: null
    }
  });

  const addTag = () => {
    if (tagInput.length >= 2 && tags.length < 5) {
      const newTag = { name: tagInput };
      setTags([...tags, newTag]);
      setValue('tags', [...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('Необхідно авторизуватися');
      }

      const { error } = await supabase
        .from('events')
        .insert([
          {
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            max_participants: data.maxParticipants,
            price: data.price,
            is_private: data.isPrivate,
            registration_deadline: data.registrationDeadline,
            tags: data.tags,
            created_by: user.data.user.id
          }
        ]);

      if (error) throw error;

      reset();
      setTags([]);
      // Можна додати повідомлення про успіх
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Помилка створення події');
    } finally {
      setIsLoading(false);
    }
  };

  const eventDate = watch('date');

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Створення нової події</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Назва події
          </label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Опис
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Дата проведення
          </label>
          <input
            type="datetime-local"
            {...register('date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Дедлайн реєстрації
          </label>
          <input
            type="datetime-local"
            {...register('registrationDeadline')}
            max={eventDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.registrationDeadline && (
            <p className="mt-1 text-sm text-red-600">
              {errors.registrationDeadline.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Локація
          </label>
          <input
            type="text"
            {...register('location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Максимальна кількість учасників
          </label>
          <input
            type="number"
            {...register('maxParticipants', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.maxParticipants && (
            <p className="mt-1 text-sm text-red-600">
              {errors.maxParticipants.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ціна (залиште порожнім для безкоштовної події)
          </label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">
              {errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Теги
          </label>
          <div className="flex gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Введіть тег"
            />
            <button
              type="button"
              onClick={addTag}
              className="mt-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Додати
            </button>
          </div>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">
              {errors.tags.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('isPrivate')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Приватна подія
          </label>
        </div>

        {serverError && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Створення...' : 'Створити подію'}
        </button>
      </form>
    </div>
  );
} 