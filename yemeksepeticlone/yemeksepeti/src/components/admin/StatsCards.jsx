import React from 'react';
import StatCard from '../common/StatCard';
import { Package, Store, Utensils, Users } from 'lucide-react';

const StatsCards = React.memo(({ ordersCount, restaurantsCount, productsCount, usersCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Toplam Sipariş"
        value={ordersCount}
        icon={<Package className="text-[#B83246]" size={20} />}
      />
      <StatCard
        title="Toplam Restoran"
        value={restaurantsCount}
        icon={<Store className="text-[#B83246]" size={20} />}
      />
      <StatCard
        title="Toplam Ürün"
        value={productsCount}
        icon={<Utensils className="text-[#B83246]" size={20} />}
      />
      <StatCard
        title="Kullanıcı Sayısı"
        value={usersCount}
        icon={<Users className="text-[#B83246]" size={20} />}
      />
    </div>
  );
});

StatsCards.displayName = 'StatsCards';

export default StatsCards;
