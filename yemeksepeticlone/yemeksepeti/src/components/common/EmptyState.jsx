import React from 'react';

const EmptyState = React.memo(({ icon = '🔍', title = 'Kayıt Bulunmadı', description = 'Aramanıza uygun veri bulunmamaktadır.', actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#17171C] border border-[#2e303a] rounded-xl text-gray-400 max-w-lg mx-auto my-6 animate-fadeIn">
      <span className="text-5xl mb-4" role="img" aria-label="empty-state-icon">
        {icon}
      </span>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-xs">{description}</p>
      {actionButton}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
