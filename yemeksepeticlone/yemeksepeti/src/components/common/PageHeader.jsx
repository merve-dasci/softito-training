import React from 'react';

const PageHeader = React.memo(({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#2e303a] gap-4 mb-6">
      <div className="text-left">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">{title}</h2>
        {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
