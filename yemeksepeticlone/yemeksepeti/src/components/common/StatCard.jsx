import React from 'react';

const StatCard = React.memo(({ title, value, icon, description }) => {
  return (
    <div className="bg-[#17171C] border border-[#2e303a] p-5 rounded-xl text-left shadow-sm hover:border-[#7A1E2C]/30 transition-all duration-300 transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <span className="text-white text-3xl font-black block mt-1">{value}</span>
      {description && <span className="text-gray-500 text-xs mt-1 block">{description}</span>}
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
