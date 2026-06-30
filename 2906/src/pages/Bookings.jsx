import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTickets, fetchBookings, cancelBooking, bookTicketSeats, setSearchCriteria } from '../store/ticketSlice';
import { Bus, Plane, CheckCircle, XCircle, Trash2, Search, PlusCircle, History } from 'lucide-react';

const Bookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { list: tickets, bookings, loading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  // Tabs: 'history' | 'addTicket' | 'search'
  const [activeTab, setActiveTab] = useState('history');

  // Search Tab State
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchType, setSearchType] = useState('bus');
  const [searchError, setSearchError] = useState('');

  // Add Ticket Tab State
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerName, setPassengerName] = useState(user ? user.name : '');
  const [passengerSurname, setPassengerSurname] = useState(user ? user.surname : '');
  const [tcNo, setTcNo] = useState('');
  const [passengerEmail, setPassengerEmail] = useState(user ? user.email : '');
  const [passengerPhone, setPassengerPhone] = useState(user ? user.phone || '' : '');
  
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  useEffect(() => {
    dispatch(fetchTickets());
    // Fetch bookings for the current logged-in user, or all if guest (just fetch all bookings)
    dispatch(fetchBookings(user ? user.id : ''));
  }, [dispatch, user]);

  // Pre-fill passenger info when user logs in/changes
  useEffect(() => {
    if (user) {
      setPassengerName(user.name);
      setPassengerSurname(user.surname);
      setPassengerEmail(user.email);
      setPassengerPhone(user.phone || '');
    }
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchError('');
    if (!searchFrom || !searchTo || !searchDate) {
      setSearchError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (searchFrom.toLowerCase() === searchTo.toLowerCase()) {
      setSearchError('Kalkış ve varış noktaları aynı olamaz.');
      return;
    }

    dispatch(setSearchCriteria({
      from: searchFrom,
      to: searchTo,
      date: searchDate,
      type: searchType
    }));
    navigate('/filter');
  };

  const handleCancelBooking = (booking) => {
    if (window.confirm('Bu bileti iptal etmek istediğinizden emin misiniz?')) {
      dispatch(cancelBooking({
        bookingId: booking.id,
        ticketId: booking.ticketId,
        seatNumbers: booking.seatsBooked
      })).then((res) => {
        if (!res.error) {
          setLocalSuccess('Bilet başarıyla iptal edildi.');
          setTimeout(() => setLocalSuccess(''), 3000);
        } else {
          setLocalError(res.payload || 'Bilet iptal edilemedi.');
        }
      });
    }
  };

  // Direct Booking Handler
  const handleDirectBookingSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');

    const trip = tickets.find(t => t.id === selectedTripId);
    if (!trip) {
      setLocalError('Lütfen geçerli bir sefer seçin.');
      return;
    }
    if (selectedSeats.length === 0) {
      setLocalError('Lütfen en az bir koltuk seçin.');
      return;
    }
    if (!passengerName || !passengerSurname || !tcNo || !passengerEmail || !passengerPhone) {
      setLocalError('Lütfen yolcu bilgilerini doldurun.');
      return;
    }
    if (tcNo.length !== 11 || !/^\d+$/.test(tcNo)) {
      setLocalError('T.C. Kimlik numarası 11 haneli sayı olmalıdır.');
      return;
    }

    const totalPrice = selectedSeats.length * trip.price;
    const passengerData = {
      id: user ? user.id : 'guest',
      name: passengerName,
      surname: passengerSurname,
      email: passengerEmail,
      phone: passengerPhone
    };

    dispatch(bookTicketSeats({
      ticket: trip,
      seatNumbers: selectedSeats,
      user: passengerData,
      totalPrice
    })).then((res) => {
      if (!res.error) {
        setLocalSuccess('Bilet rezervasyonu başarıyla yapıldı!');
        // Refresh local bookings list
        dispatch(fetchBookings(user ? user.id : ''));
        // Reset direct booking states
        setSelectedTripId('');
        setSelectedSeats([]);
        setTcNo('');
        setActiveTab('history');
        setTimeout(() => setLocalSuccess(''), 4000);
      } else {
        setLocalError(res.payload || 'Bilet alınırken hata oluştu.');
      }
    });
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied') return;
    if (selectedSeats.includes(seat.number)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.number));
    } else {
      if (selectedSeats.length >= 4) {
        setLocalError('En fazla 4 koltuk seçebilirsiniz.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat.number]);
      setLocalError('');
    }
  };

  const selectedTrip = tickets.find(t => t.id === selectedTripId);

  // Filter bookings for user
  const userBookings = user 
    ? bookings.filter(b => b.userId === user.id) 
    : bookings.filter(b => b.userId === 'guest');

  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] py-8 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Title */}
        <div className="border-b border-slate-850 pb-6 mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <History className="h-6 w-6 text-blue-400" />
            <span>Bilet Yönetimi & Geçmişi</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Bilet geçmişinizi sorgulayabilir, yeni bilet satın alabilir veya sefer arayabilirsiniz.</p>
        </div>

        {/* Local Messages */}
        {localError && (
          <div className="mb-6 bg-red-950/20 border border-red-900/50 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>{localError}</span>
          </div>
        )}
        {localSuccess && (
          <div className="mb-6 bg-emerald-950/20 border border-emerald-900/50 text-emerald-450 p-4 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{localSuccess}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-slate-850 mb-8 space-x-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-450 hover:text-slate-200'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Bilet Geçmişi ({userBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addTicket')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
              activeTab === 'addTicket'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-450 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Yeni Bilet Ekle</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all ${
              activeTab === 'search'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-450 hover:text-slate-200'
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Sefer Ara</span>
          </button>
        </div>

        {/* Tab Content Render */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {loading && bookings.length === 0 ? (
              <p className="text-xs text-slate-500">Bilet geçmişi yükleniyor...</p>
            ) : userBookings.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xl max-w-md mx-auto">
                <History className="h-10 w-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold">Kayıtlı Bilet Bulunmuyor</h3>
                <p className="text-xs text-slate-500">Henüz satın alınmış veya kaydedilmiş bir bilet geçmişiniz bulunmuyor.</p>
                <button
                  onClick={() => setActiveTab('addTicket')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all"
                >
                  Yeni Bilet Rezervasyonu Yap
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      
                      {/* Booking Title */}
                      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 bg-slate-950 p-1.5 rounded-lg border border-slate-850">
                            {booking.type === 'bus' ? <Bus className="h-4 w-4" /> : <Plane className="h-4 w-4" />}
                          </span>
                          <span className="font-bold text-sm">{booking.company}</span>
                        </div>
                        <span className="font-mono text-[10px] bg-slate-950 border border-slate-850 px-2 py-1 rounded text-slate-400 tracking-wider">
                          PNR: GB{booking.id.substring(0, 6).toUpperCase()}
                        </span>
                      </div>

                      {/* Route Details */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Güzergah</span>
                          <span className="text-slate-200 font-semibold">{booking.departure} &rarr; {booking.arrival}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Yolcu</span>
                          <span className="text-slate-200 font-semibold">{booking.userName}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs border-t border-slate-850/40 pt-2.5">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Tarih & Saat</span>
                          <span className="text-slate-200 font-semibold">{booking.date} &bull; {booking.time}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Koltuk(lar)</span>
                          <span className="text-blue-400 font-bold">{booking.seatsBooked.join(', ')}</span>
                        </div>
                      </div>

                    </div>

                    {/* Footer Cancel Action */}
                    <div className="flex items-center justify-between border-t border-slate-850/60 pt-4 mt-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Ödenen Tutar</span>
                        <span className="text-emerald-400 font-black text-sm">{booking.pricePaid} TL</span>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all text-xs font-semibold"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Bilet İptal</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'addTicket' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-3 mb-6 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-400" />
              <span>Hızlı Bilet Rezervasyon Formu</span>
            </h3>

            <form onSubmit={handleDirectBookingSubmit} className="space-y-6">
              
              {/* Trip Selection Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Sefer Seçin</label>
                <select
                  value={selectedTripId}
                  onChange={(e) => {
                    setSelectedTripId(e.target.value);
                    setSelectedSeats([]);
                  }}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Sefer Seçin --</option>
                  {tickets.map(t => {
                    const freeSeats = t.seats.filter(s => s.status === 'available').length;
                    return (
                      <option key={t.id} value={t.id}>
                        [{t.type.toUpperCase()}] {t.company} - {t.departure} &rarr; {t.arrival} ({t.date} &bull; {t.time}) - {t.price} TL ({freeSeats} Boş Koltuk)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Seat Selection Panel */}
              {selectedTrip && (
                <div className="border border-slate-850 bg-slate-950 p-6 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                    Koltuk Seçimi ({selectedTrip.company})
                  </h4>

                  {/* Seat Map rendering logic */}
                  <div className="flex justify-center">
                    {selectedTrip.type === 'bus' ? (
                      <div className="grid grid-cols-5 gap-2 max-w-xs">
                        {Array.from({ length: Math.ceil(selectedTrip.seats.length / 4) }).map((_, rIdx) => (
                          <React.Fragment key={rIdx}>
                            {[0, 1].map(colIdx => {
                              const sIdx = rIdx * 4 + colIdx;
                              if (sIdx >= selectedTrip.seats.length) return <div key={colIdx} />;
                              const seat = selectedTrip.seats[sIdx];
                              const isSelected = selectedSeats.includes(seat.number);
                              return (
                                <button
                                  type="button"
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`h-9 w-9 rounded-lg text-xs font-bold transition-all ${
                                    seat.status === 'occupied'
                                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                                      : 'bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-850'
                                  }`}
                                >
                                  {seat.number}
                                </button>
                              );
                            })}
                            <div className="col-span-1 flex items-center justify-center text-[8px] text-slate-700 font-bold">||</div>
                            {[2, 3].map(colIdx => {
                              const sIdx = rIdx * 4 + colIdx;
                              if (sIdx >= selectedTrip.seats.length) return <div key={colIdx} />;
                              const seat = selectedTrip.seats[sIdx];
                              const isSelected = selectedSeats.includes(seat.number);
                              return (
                                <button
                                  type="button"
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  className={`h-9 w-9 rounded-lg text-xs font-bold transition-all ${
                                    seat.status === 'occupied'
                                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                                      : 'bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-850'
                                  }`}
                                >
                                  {seat.number}
                                </button>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 gap-1.5 max-w-sm">
                        {selectedTrip.seats.map((seat) => {
                          const isSelected = selectedSeats.includes(seat.number);
                          const isAisle = seat.number.includes('C');
                          return (
                            <React.Fragment key={seat.id}>
                              <button
                                type="button"
                                onClick={() => handleSeatClick(seat)}
                                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                                  seat.status === 'occupied'
                                    ? 'bg-slate-800 text-slate-650 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-blue-600 text-white border border-blue-500'
                                    : 'bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-850'
                                }`}
                              >
                                {seat.number}
                              </button>
                              {isAisle && <div className="col-span-1 flex items-center justify-center text-[10px] text-slate-700">|</div>}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-6 text-[10px] text-slate-500 border-t border-slate-900 pt-3">
                    <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-slate-900 border border-slate-800 rounded"></span><span>Boş</span></div>
                    <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-slate-800 rounded"></span><span>Dolu</span></div>
                    <div className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-blue-600 rounded"></span><span>Seçili</span></div>
                  </div>
                </div>
              )}

              {/* Passenger Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Yolcu Adı</label>
                    <input
                      type="text"
                      placeholder="Adı"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Yolcu Soyadı</label>
                    <input
                      type="text"
                      placeholder="Soyadı"
                      value={passengerSurname}
                      onChange={(e) => setPassengerSurname(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">T.C. Kimlik No</label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="11 haneli kimlik no"
                      value={tcNo}
                      onChange={(e) => setTcNo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">E-posta</label>
                    <input
                      type="email"
                      placeholder="E-posta adresi"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Telefon</label>
                    <input
                      type="tel"
                      placeholder="Telefon numarası"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Overview */}
              {selectedTrip && selectedSeats.length > 0 && (
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500">Seçilen Koltuklar:</span>
                    <span className="font-bold text-blue-400 ml-1">{selectedSeats.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-550 font-bold">Toplam Tutar:</span>
                    <span className="text-sm font-black text-emerald-450 ml-1.5">
                      {selectedSeats.length * selectedTrip.price} TL
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-500/20"
              >
                Bilet Ekle
              </button>

            </form>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl max-w-xl mx-auto">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-3 mb-6 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-400" />
              <span>GezginBilet Hızlı Sefer Arama</span>
            </h3>

            {searchError && (
              <div className="mb-4 bg-red-950/20 border border-red-900/50 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              {/* Type selector */}
              <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-lg max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setSearchType('bus')}
                  className={`flex-1 text-center py-1.5 rounded text-xs font-semibold transition-all ${
                    searchType === 'bus' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-450 hover:text-slate-200'
                  }`}
                >
                  Otobüs
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('flight')}
                  className={`flex-1 text-center py-1.5 rounded text-xs font-semibold transition-all ${
                    searchType === 'flight' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-450 hover:text-slate-200'
                  }`}
                >
                  Uçak
                </button>
              </div>

              {/* Cities */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nereden</label>
                  <input
                    type="text"
                    placeholder="Kalkış Yeri"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 placeholder-slate-750 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nereye</label>
                  <input
                    type="text"
                    placeholder="Varış Yeri"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 placeholder-slate-750 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tarih</label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
              >
                <Search className="h-4 w-4" />
                <span>Seferleri Ara ve Karşılaştır</span>
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Bookings;
