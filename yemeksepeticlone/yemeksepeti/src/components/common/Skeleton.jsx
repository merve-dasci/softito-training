import React from 'react';

const Skeleton = React.memo(({ variant = 'text', count = 1, className = '' }) => {
  const getSkeletonItem = (index) => {
    switch (variant) {
      case 'card':
        return (
          <div
            key={index}
            className={`bg-[#17171C] border border-[#2e303a] rounded-xl overflow-hidden shadow-md p-0 flex flex-col h-full animate-pulse ${className}`}
          >
            {/* Image block */}
            <div className="h-48 w-full bg-[#1C1C24]" />
            {/* Details block */}
            <div className="p-5 space-y-3 flex-grow">
              <div className="h-5 bg-[#1C1C24] rounded-md w-3/4" />
              <div className="h-3 bg-[#1C1C24] rounded-md w-1/2" />
              <div className="h-8 bg-[#1C1C24] rounded-md w-full pt-2 mt-4" />
            </div>
          </div>
        );

      case 'table-row':
        return (
          <tr key={index} className="animate-pulse border-b border-[#2e303a]/50">
            <td className="px-6 py-4"><div className="h-4 bg-[#1C1C24] rounded w-8" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-[#1C1C24] rounded w-28" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-[#1C1C24] rounded w-24" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-[#1C1C24] rounded w-16" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-[#1C1C24] rounded w-20" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-[#1C1C24] rounded w-20" /></td>
          </tr>
        );

      case 'order-card':
        return (
          <div
            key={index}
            className={`bg-[#17171C] border border-[#2e303a] rounded-xl p-5 space-y-4 shadow-sm animate-pulse ${className}`}
          >
            <div className="flex justify-between pb-4 border-b border-[#2e303a] gap-2">
              <div className="space-y-2">
                <div className="h-5 bg-[#1C1C24] rounded w-40" />
                <div className="h-3 bg-[#1C1C24] rounded w-20" />
              </div>
              <div className="h-8 bg-[#1C1C24] rounded w-24" />
            </div>
            <div className="h-10 bg-[#1C1C24] rounded w-full" />
          </div>
        );

      case 'text':
      default:
        return (
          <div key={index} className={`space-y-2 animate-pulse ${className}`}>
            <div className="h-4 bg-[#1C1C24] rounded-md w-full" />
            <div className="h-4 bg-[#1C1C24] rounded-md w-5/6" />
            <div className="h-4 bg-[#1C1C24] rounded-md w-2/3" />
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => getSkeletonItem(idx))}
    </>
  );
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;
