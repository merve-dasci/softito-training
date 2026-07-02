import React from 'react';
import { Store, Users, ClipboardList, TrendingUp } from 'lucide-react';

const AdminSidebar = React.memo(({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'restaurants', name: 'Restoran Yönetimi', icon: <Store size={16} /> },
    { id: 'users', name: 'Kullanıcı Yönetimi', icon: <Users size={16} /> },
    { id: 'orders', name: 'Sipariş Takibi', icon: <ClipboardList size={16} /> },
    { id: 'dashboard', name: 'Platform Özeti', icon: <TrendingUp size={16} /> },
  ];

  return (
    <div className="bg-[#17171C] border border-[#2e303a] rounded-xl p-4 space-y-2 h-full flex flex-row lg:flex-col justify-start lg:space-y-2 flex-wrap lg:flex-nowrap gap-2 lg:gap-0">
      <div className="hidden lg:block text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2 mb-2 text-left">
        Admin Kontrolleri
      </div>
      
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 flex items-center space-x-2.5 ${
            activeTab === tab.id
              ? 'bg-[#7A1E2C] text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-[#0B0B0F]/50 border border-transparent hover:border-[#2e303a]'
          }`}
        >
          {tab.icon}
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
});

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;
