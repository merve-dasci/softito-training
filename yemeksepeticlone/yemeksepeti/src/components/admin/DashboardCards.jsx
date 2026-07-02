import React from 'react';
import { DollarSign, Truck } from 'lucide-react';

const DashboardCards = React.memo(({ orders = [] }) => {
  const totalRevenue = orders
    .filter((o) => o.status === 'Teslim edildi')
    .reduce((sum, o) => sum + (parseFloat(o.totalPrice) || 0), 0);

  const activeOrders = orders.filter((o) => o.status === 'Hazırlanıyor' || o.status === 'Yolda').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      
      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-[#4A0F1C] to-[#17171C] border border-[#2e303a]/50 p-6 rounded-xl text-left shadow-md flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Toplam Teslim Edilen Hasılat</span>
          <span className="text-white text-3xl font-black block">{totalRevenue} TL</span>
          <p className="text-gray-500 text-xs">Tamamlanmış siparişlerin genel toplamıdır.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#7A1E2C]/20 border border-[#7A1E2C]/30 flex items-center justify-center text-white">
          <DollarSign size={24} className="text-[#B83246]" />
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="bg-[#17171C] border border-[#2e303a] p-6 rounded-xl text-left shadow-md flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Aktif Sevkiyatlar</span>
          <span className="text-white text-3xl font-black block">{activeOrders} Sipariş</span>
          <p className="text-gray-500 text-xs">Şu an yolda veya hazırlanan siparişlerdir.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Truck size={24} className="text-blue-400" />
        </div>
      </div>

    </div>
  );
});

DashboardCards.displayName = 'DashboardCards';

export default DashboardCards;
