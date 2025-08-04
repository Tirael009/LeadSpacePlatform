// src/components/layout/Sidebar.tsx

import React from 'react';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-700 text-white py-4">
      <ul>
        <li>Главная</li>
        <li>О нас</li>
        <li>Контакты</li>
      </ul>
    </aside>
  );
};