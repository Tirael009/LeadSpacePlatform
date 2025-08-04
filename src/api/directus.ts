// src/api/directus.ts

import { createDirectus, rest, authentication } from '@directus/sdk';
import type { Schema } from '../types/Schema';

const directus = createDirectus<Schema>(import.meta.env.VITE_DIRECTUS_URL)
  .with(rest())
  .with(authentication());

// Авторизация через e-mail и пароль (можно вызвать в useEffect или вручную при логине)
export const loginToDirectus = async () => {
  try {
    await directus.login({
      email: import.meta.env.VITE_DIRECTUS_EMAIL,
      password: import.meta.env.VITE_DIRECTUS_PASSWORD,
    });
    console.log('🟢 Logged in to Directus successfully');
  } catch (error) {
    console.error('🔴 Directus login failed:', error);
  }
};

export { directus };