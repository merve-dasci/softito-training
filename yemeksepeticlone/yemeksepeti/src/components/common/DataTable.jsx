import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const DataTable = React.memo(({ columns, data, searchPlaceholder = 'Ara...', filterKey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (!searchQuery) return true;
      if (filterKey) {
        const val = item[filterKey];
        return val && String(val).toLowerCase().includes(searchQuery.toLowerCase());
      }
      return Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery, filterKey]);

  // Pagination bounds
  const { currentItems, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: filteredData.slice(indexOfFirstItem, indexOfLastItem),
      totalPages
    };
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset page on limit change
  };

  return (
    <div className="bg-[#17171C] border border-[#2e303a] rounded-xl overflow-hidden shadow-lg space-y-4">
      
      {/* Search and limit selection header */}
      <div className="p-4 border-b border-[#2e303a]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search input with Lucide */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#0B0B0F] border border-[#2e303a] rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-[#7A1E2C] transition-colors duration-200 text-sm"
          />
        </div>

        {/* Rows Selector & Stats */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>Sayfa Başına:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-[#0B0B0F] border border-[#2e303a] rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#7A1E2C] font-semibold"
            >
              <option value={5}>5 Satır</option>
              <option value={10}>10 Satır</option>
              <option value={20}>20 Satır</option>
            </select>
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Toplam Kayıt: <strong className="text-white">{filteredData.length}</strong>
          </div>
        </div>

      </div>

      {/* Table grid layout */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#0B0B0F]/50 border-b border-[#2e303a] text-gray-400 font-bold uppercase tracking-wider text-[11px]">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2e303a]/50 text-gray-300">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 align-middle">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Inbox size={32} className="text-gray-600 animate-pulse" />
                    <span className="text-sm font-semibold text-gray-400">Kayıt Bulunmamaktadır.</span>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item, rowIdx) => (
                <tr
                  key={item.id || rowIdx}
                  className="hover:bg-[#0B0B0F]/30 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap align-middle">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls with Lucide */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#2e303a]/50 flex items-center justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 bg-[#0B0B0F] text-gray-400 hover:text-white border border-[#2e303a] px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition hover:border-gray-600"
          >
            <ChevronLeft size={14} />
            <span>Önceki</span>
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                  currentPage === page
                    ? 'bg-[#7A1E2C] text-white border border-[#7A1E2C]'
                    : 'bg-[#0B0B0F] text-gray-400 border border-[#2e303a] hover:border-gray-500'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 bg-[#0B0B0F] text-gray-400 hover:text-white border border-[#2e303a] px-3 py-1.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition hover:border-gray-600"
          >
            <span>Sonraki</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
