import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTickets, setSearchCriteria } from '../store/ticketSlice';
import { Bus, Plane, Calendar, MapPin, ArrowRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Filter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { list: tickets, searchCriteria, loading } = useSelector((state) => state.tickets);

  // Local state for sidebar filters, initialized from Redux criteria
  const [localFrom, setLocalFrom] = useState(searchCriteria.from || '');
  const [localTo, setLocalTo] = useState(searchCriteria.to || '');
  const [localDate, setLocalDate] = useState(searchCriteria.date || '');
  const [localType, setLocalType] = useState(searchCriteria.type || 'bus');
  
  // Filtering states
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [minAvailableSeats, setMinAvailableSeats] = useState(1);
  const [sortBy, setSortBy] = useState('price-asc'); // 'price-asc', 'price-desc', 'time-asc'

  useEffect(() => {
    if (tickets.length === 0) {
      dispatch(fetchTickets());
    }
  }, [dispatch, tickets.length]);

  // Synchronize local search state if Redux changes (e.g. from quick searches)
  useEffect(() => {
    setLocalFrom(searchCriteria.from);
    setLocalTo(searchCriteria.to);
    setLocalDate(searchCriteria.date);
    setLocalType(searchCriteria.type);
  }, [searchCriteria]);

  // Apply search and filters on tickets list
  const filteredTickets = tickets.filter(ticket => {
    // 1. Core Route matching (case insensitive)
    const matchFrom = localFrom ? ticket.departure.toLowerCase().includes(localFrom.toLowerCase()) : true;
    const matchTo = localTo ? ticket.arrival.toLowerCase().includes(localTo.toLowerCase()) : true;
    
    // 2. Date matching
    const matchDate = localDate ? ticket.date === localDate : true;
    
    // 3. Type matching
    const matchType = ticket.type === localType;

    // 4. Sidebar filters
    const matchPrice = ticket.price <= maxPrice;
    
    const matchCompany = selectedCompany === 'All' ? true : ticket.company === selectedCompany;
    
    // Seat count
    const freeSeatsCount = ticket.seats.filter(s => s.status === 'available').length;
    const matchSeats = freeSeatsCount >= minAvailableSeats;

    return matchFrom && matchTo && matchDate && matchType && matchPrice && matchCompany && matchSeats;
  });

  // Sort logic
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    } else if (sortBy === 'time-asc') {
      return a.time.localeCompare(b.time);
    }
    return 0;
  });

  // Extract unique companies for filtering dropdown
  const companies = ['All', ...new Set(tickets.filter(t => t.type === localType).map(t => t.company))];

  const handleApplySearch = (e) => {
    e.preventDefault();
    dispatch(setSearchCriteria({
      from: localFrom,
      to: localTo,
      date: localDate,
      type: localType
    }));
  };

  const handleGoToDetail = (ticketId) => {
    navigate(`/detail/${ticketId}`);
  };

  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Search Update Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-lg">
          <form onSubmit={handleApplySearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nereden</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={localFrom}
                  onChange={(e) => setLocalFrom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nereye</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={localTo}
                  onChange={(e) => setLocalTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tarih</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="date"
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tür</label>
              <select
                value={localType}
                onChange={(e) => setLocalType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 h-[38px]"
              >
                <option value="bus">Otobüs</option>
                <option value="flight">Uçak</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center space-x-2 h-[38px]"
            >
              <span>Güncelle</span>
            </button>
          </form>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter Section */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h3 className="font-bold flex items-center space-x-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                  <span>Filtrele & Sırala</span>
                </h3>
              </div>

              {/* Sort Options */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                    <ArrowUpDown className="h-3 w-3" />
                    <span>Sıralama</span>
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="price-asc">Fiyat: Artan</option>
                    <option value="price-desc">Fiyat: Azalan</option>
                    <option value="time-asc">Saat: En Erken</option>
                  </select>
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4 mb-6 border-t border-slate-800/50 pt-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Maksimum Fiyat</span>
                    <span className="text-blue-400 font-bold">{maxPrice} TL</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="2500"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* Company Filter */}
              <div className="space-y-4 mb-6 border-t border-slate-800/50 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Firma Seçimi</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {companies.map(co => (
                      <option key={co} value={co}>
                        {co === 'All' ? 'Tüm Firmalar' : co}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Empty Seats Filter */}
              <div className="space-y-4 border-t border-slate-800/50 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Minimum Boş Koltuk</label>
                  <select
                    value={minAvailableSeats}
                    onChange={(e) => setMinAvailableSeats(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value={1}>En az 1 boş koltuk</option>
                    <option value={5}>En az 5 boş koltuk</option>
                    <option value={10}>En az 10 boş koltuk</option>
                  </select>
                </div>
              </div>

            </div>
          </aside>

          {/* Right Main Ticket List Section */}
          <main className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12 text-slate-400 text-sm">
                Seferler Yükleniyor...
              </div>
            ) : sortedTickets.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg">
                <p className="text-slate-400 text-sm mb-4">Aradığınız kriterlere uygun sefer bulunamadı.</p>
                <button
                  type="button"
                  onClick={() => {
                    setLocalFrom('');
                    setLocalTo('');
                    setLocalDate('');
                    setSelectedCompany('All');
                    setMaxPrice(2000);
                  }}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs font-semibold py-2 px-4 rounded-xl text-slate-300 transition-all"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              sortedTickets.map(ticket => {
                const freeSeats = ticket.seats.filter(s => s.status === 'available').length;
                
                return (
                  <div 
                    key={ticket.id}
                    className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/50 rounded-2xl p-6 shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6"
                  >
                    {/* Company Info */}
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shrink-0 text-blue-400">
                        {ticket.type === 'bus' ? <Bus className="h-6 w-6" /> : <Plane className="h-6 w-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{ticket.company}</h4>
                        <span className="text-xs text-slate-500 capitalize">{ticket.type === 'bus' ? 'Otobüs' : 'Uçak'}</span>
                      </div>
                    </div>

                    {/* Route and Time Info */}
                    <div className="flex items-center justify-center space-x-6 text-center w-full md:w-auto">
                      <div>
                        <span className="block text-xl font-bold text-white">{ticket.time}</span>
                        <span className="text-xs text-slate-400">{ticket.departure}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">{ticket.duration}</span>
                        <div className="flex items-center space-x-1 my-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-750"></span>
                          <span className="h-0.5 w-12 bg-slate-800"></span>
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">{ticket.date}</span>
                      </div>
                      <div>
                        <span className="block text-xl font-bold text-white">
                          {/* Calculate arrival time for simplicity */}
                          {(() => {
                            const [h, m] = ticket.time.split(':').map(Number);
                            const durationHours = parseInt(ticket.duration);
                            const arrivalH = (h + durationHours) % 24;
                            return `${arrivalH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                          })()}
                        </span>
                        <span className="text-xs text-slate-400">{ticket.arrival}</span>
                      </div>
                    </div>

                    {/* Price and Action Section */}
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-slate-800/50 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Bilet Fiyatı</span>
                        <span className="text-2xl font-black text-blue-400">{ticket.price} TL</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{freeSeats} Koltuk Boş</span>
                      </div>
                      <button
                        onClick={() => handleGoToDetail(ticket.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 flex items-center space-x-1"
                      >
                        <span>Detayları Gör</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default Filter;
