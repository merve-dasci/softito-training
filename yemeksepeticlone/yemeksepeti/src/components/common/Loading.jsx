import React from 'react';

const Loading = React.memo(({ message = 'Yükleniyor...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-3 animate-fadeIn">
      <div className="w-10 h-10 border-4 border-t-[#B83246] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-semibold tracking-wide">{message}</p>
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
