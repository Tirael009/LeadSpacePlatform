import { 
  createDirectus, 
  rest, 
  authentication, 
  readMe,
  createItem
} from '@directus/sdk';
import type { Schema } from '../types/Schema';

interface UserCreateData {
  role: string;
  [key: string]: unknown;
}

const getDirectusUrl = () => {
  const url = import.meta.env.VITE_DIRECTUS_URL;
  
  // Автоматическое преобразование относительных путей в абсолютные
  if (url.startsWith('/') && import.meta.env.DEV) {
    return `${window.location.origin}${url}`;
  }
  
  return url;
};

export const directus = createDirectus<Schema>(getDirectusUrl())
  .with(rest())
  .with(authentication());

export const loginToDirectus = async (email: string, password: string) => {
  try {
    await directus.login({ email, password });
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    return await directus.request(readMe());
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const createUser = async (userData: UserCreateData) => {
  try {
    const roleId = userData.role === 'lender' 
      ? import.meta.env.VITE_DIRECTUS_LENDER_ROLE_ID 
      : import.meta.env.VITE_DIRECTUS_PUBLISHER_ROLE_ID;

    // Создаем объект с явной типизацией
    const userPayload: Record<string, unknown> = {
      ...userData,
      role: roleId
    };

    // Удаляем undefined-поля с безопасным доступом
    Object.keys(userPayload).forEach(key => {
      if (userPayload[key] === undefined) {
        delete userPayload[key];
      }
    });

    const created = await directus.request(
      createItem('users', userPayload)
    );
    return created;
  } catch (error: unknown) {
    console.error('User creation failed:', error);
    throw new Error('Registration failed. Please try again.');
  }
};