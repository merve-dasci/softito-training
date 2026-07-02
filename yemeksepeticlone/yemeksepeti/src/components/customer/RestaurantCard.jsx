import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const RestaurantCard = React.memo(({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#17171C] border border-[#2e303a] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#7A1E2C]/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full text-left">
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-800">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-[#0B0B0F]/80 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center space-x-1 border border-[#2e303a]">
          <Star size={13} className="text-yellow-400" fill="currentColor" />
          <span className="text-white text-xs font-bold">{restaurant.rating || '4.5'}</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-[#7A1E2C] text-white px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
          {restaurant.category}
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center text-gray-400 text-sm mb-4 space-x-1.5">
            <Clock size={14} />
            <span>{restaurant.deliveryTime || '25-35 dk'}</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/restaurants/${restaurant.id}`)}
          className="w-full bg-transparent hover:bg-[#7A1E2C] text-white border border-[#7A1E2C] font-semibold py-2.5 rounded-lg transition-colors duration-200 text-center text-sm uppercase tracking-wider"
        >
          Detaya Git & Menüyü Gör
        </button>
      </div>
    </div>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

export default RestaurantCard;
