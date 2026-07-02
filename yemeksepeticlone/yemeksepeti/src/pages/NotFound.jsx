import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <h1 className="text-6xl font-bold text-red-700 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Aradığınız sayfa bulunamadı!</h2>
      <p className="text-gray-400 mb-6">Ulaşmaya çalıştığınız adres silinmiş veya hiç var olmamış olabilir.</p>
      <Link to="/" className="bg-[#7A1E2C] hover:bg-[#B83246] text-white px-6 py-2 rounded transition">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

export default NotFound;
