import { Directus } from '@directus/sdk';

type Collections = {
  leads: Lead;
  users: User;
  // ... другие коллекции
};

export const directus = new Directus<Collections>(
  import.meta.env.VITE_DIRECTUS_URL,
  {
    auth: {
      mode: 'cookie', // Для безопасного хранения токена
    },
  }
);

// Обёртка для обработки ошибок
export const safeRequest = async <T>(promise: Promise<T>) => {
  try {
    return await promise;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};