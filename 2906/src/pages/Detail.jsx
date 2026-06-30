import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectTicketById, clearSelectedTicket } from '../store/ticketSlice';
import { Bus, Plane, ChevronRight, XCircle } from 'lucide-react';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedTicket, loading, error } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  // Wizard state: 'seats' | 'payment' | 'success' | 'failed'
  const step = 'seats';
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Passenger Info
  const [passengerName, setPassengerName] = useState('');
  const [passengerSurname, setPassengerSurname] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');

  const [localValidationError, setLocalValidationError] = useState('');

  useEffect(() => {
    dispatch(selectTicketById(id));
    return () => {
      dispatch(clearSelectedTicket());
    };
  }, [dispatch, id]);

  // Pre-fill passenger info if user is logged in
  useEffect(() => {
    if (user) {
      setPassengerName(user.name);
      setPassengerSurname(user.surname);
      setPassengerEmail(user.email);
      setPassengerPhone(user.phone || '');
    }
  }, [user]);

  if (loading && !selectedTicket) {
    return (
      <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Sefer detayları yükleniyor...</p>
      </div>
    );
  }

  if (error || !selectedTicket) {
    return (
      <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] flex items-center justify-center">
        <p className="text-red-400 text-sm">{error || 'Sefer bulunamadı.'}</p>
      </div>
    );
  }

  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied') return;
    
    if (selectedSeats.includes(seat.number)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.number));
    } else {
      // Limit selection to 4 seats
      if (selectedSeats.length >= 4) {
        setLocalValidationError('Bir seferde en fazla 4 koltuk seçebilirsiniz.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat.number]);
      setLocalValidationError('');
    }
  };

  const handleGoToPayment = (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      setLocalValidationError('Lütfen en az bir koltuk seçin.');
      return;
    }
    if (!passengerName || !passengerSurname || !tcNo || !passengerEmail || !passengerPhone) {
      setLocalValidationError('Lütfen yolcu bilgilerini eksiksiz doldurun.');
      return;
    }
    if (tcNo.length !== 11 || !/^\d+$/.test(tcNo)) {
      setLocalValidationError('Geçersiz T.C. Kimlik Numarası (11 haneli sayı olmalıdır).');
      return;
    }
    setLocalValidationError('');

    // Redirect to Payment page with state
    navigate('/payment', {
      state: {
        ticket: selectedTicket,
        selectedSeats: selectedSeats,
        passenger: {
          id: user ? user.id : 'guest',
          name: passengerName,
          surname: passengerSurname,
          tcNo: tcNo,
          email: passengerEmail,
          phone: passengerPhone
        },
        totalPrice: selectedSeats.length * selectedTicket.price
      }
    });
  };

  const totalPrice = selectedSeats.length * selectedTicket.price;

  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        
        {/* Breadcrumb / Steps */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
          <span className={step === 'seats' ? 'text-blue-400 font-bold' : 'text-slate-400'}>1. Koltuk Seçimi</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-700" />
          <span className={step === 'payment' ? 'text-blue-400 font-bold' : 'text-slate-500'}>2. Güvenli Ödeme</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-700" />
          <span className={step === 'success' || step === 'failed' ? 'text-blue-400 font-bold' : 'text-slate-500'}>3. Sonuç</span>
        </div>

        {/* Ticket Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-blue-400">
                {selectedTicket.type === 'bus' ? <Bus className="h-5 w-5" /> : <Plane className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{selectedTicket.company}</h2>
                <p className="text-xs text-slate-500 uppercase font-semibold">{selectedTicket.date} &bull; {selectedTicket.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 md:col-span-2 justify-center">
              <span className="font-bold text-sm text-slate-300">{selectedTicket.departure}</span>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{selectedTicket.duration}</span>
                <span className="h-0.5 w-16 bg-slate-800 my-1 block"></span>
              </div>
              <span className="font-bold text-sm text-slate-300">{selectedTicket.arrival}</span>
            </div>

            <div className="text-right">
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Koltuk Başına</span>
              <span className="text-2xl font-black text-blue-400">{selectedTicket.price} TL</span>
            </div>
          </div>
        </div>

        {localValidationError && (
          <div className="mb-6 bg-red-950/30 border border-red-900/50 text-red-400 p-3 rounded-lg text-sm flex items-center space-x-2">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>{localValidationError}</span>
          </div>
        )}

        {/* Dynamic Wizard Step Rendering */}
        {step === 'seats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Seat Map Panel */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col items-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 w-full text-center border-b border-slate-800 pb-3">
                Koltuk Seçimi
              </h3>

              {selectedTicket.type === 'bus' ? (
                /* Bus Seat Schema 2+2 layout */
                <div className="border border-slate-800 bg-slate-950 p-6 rounded-2xl relative w-full max-w-sm">
                  {/* Front of Bus indicator */}
                  <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center text-xs text-slate-500">
                    <span>Ön Kısım (Şoför)</span>
                    <span className="h-2 w-8 bg-slate-800 rounded-full"></span>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {/* Render bus seats */}
                    {Array.from({ length: Math.ceil(selectedTicket.seats.length / 4) }).map((_, rowIndex) => {
                      return (
                        <React.Fragment key={rowIndex}>
                          {/* Seat 1 (Window Left) */}
                          {(() => {
                            const seatIndex = rowIndex * 4;
                            if (seatIndex >= selectedTicket.seats.length) return null;
                            const seat = selectedTicket.seats[seatIndex];
                            const isSelected = selectedSeats.includes(seat.number);
                            return (
                              <button
                                type="button"
                                onClick={() => handleSeatClick(seat)}
                                className={`h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                  seat.status === 'occupied'
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-850'
                                    : isSelected
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                                    : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300'
                                }`}
                              >
                                {seat.number}
                              </button>
                            );
                          })()}

                          {/* Seat 2 (Aisle Left) */}
                          {(() => {
                            const seatIndex = rowIndex * 4 + 1;
                            if (seatIndex >= selectedTicket.seats.length) return null;
                            const seat = selectedTicket.seats[seatIndex];
                            const isSelected = selectedSeats.includes(seat.number);
                            return (
                              <button
                                type="button"
                                onClick={() => handleSeatClick(seat)}
                                className={`h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                  seat.status === 'occupied'
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-850'
                                    : isSelected
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                                    : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300'
                                }`}
                              >
                                {seat.number}
                              </button>
                            );
                          })()}

                          {/* Corridor */}
                          <div className="col-span-1 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                            ||
                          </div>

                          {/* Seat 3 (Aisle Right) */}
                          {(() => {
                            const seatIndex = rowIndex * 4 + 2;
                            if (seatIndex >= selectedTicket.seats.length) return null;
                            const seat = selectedTicket.seats[seatIndex];
                            const isSelected = selectedSeats.includes(seat.number);
                            return (
                              <button
                                type="button"
                                onClick={() => handleSeatClick(seat)}
                                className={`h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                  seat.status === 'occupied'
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-850'
                                    : isSelected
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                                    : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300'
                                }`}
                              >
                                {seat.number}
                              </button>
                            );
                          })()}

                          {/* Seat 4 (Window Right) */}
                          {(() => {
                            const seatIndex = rowIndex * 4 + 3;
                            if (seatIndex >= selectedTicket.seats.length) return null;
                            const seat = selectedTicket.seats[seatIndex];
                            const isSelected = selectedSeats.includes(seat.number);
                            return (
                              <button
                                type="button"
                                onClick={() => handleSeatClick(seat)}
                                className={`h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                  seat.status === 'occupied'
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-850'
                                    : isSelected
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                                    : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300'
                                }`}
                              >
                                {seat.number}
                              </button>
                            );
                          })()}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Flight cabin diagram or seat map */
                <div className="border border-slate-800 bg-slate-950 p-6 rounded-2xl relative w-full max-w-sm">
                  <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center text-xs text-slate-500">
                    <span>Kabin Önü (Kokpit)</span>
                    <span className="h-2 w-8 bg-slate-800 rounded-full"></span>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {/* Render flight seats (1A to 2D etc.) */}
                    {selectedTicket.seats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.number);
                      const isAisle = seat.number.includes('C'); // Simulating Aisle after B and before D
                      
                      return (
                        <React.Fragment key={seat.id}>
                          <button
                            type="button"
                            onClick={() => handleSeatClick(seat)}
                            className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                              seat.status === 'occupied'
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-850'
                                : isSelected
                                ? 'bg-blue-600 text-white border border-blue-500 shadow-md'
                                : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300'
                            }`}
                          >
                            {seat.number}
                          </button>
                          {isAisle && (
                            <div className="col-span-1 flex items-center justify-center text-[10px] text-slate-650">
                              |
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legends */}
              <div className="flex space-x-6 mt-6 text-xs text-slate-450 border-t border-slate-800/50 pt-4 w-full justify-center">
                <div className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 bg-slate-900 border border-slate-800 rounded"></span>
                  <span>Boş</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 bg-slate-800 border border-slate-850 rounded"></span>
                  <span>Dolu</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="h-3 w-3 bg-blue-600 rounded"></span>
                  <span>Seçili</span>
                </div>
              </div>
            </div>

            {/* Passenger Info & Checkout summary Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                Yolcu & Fiyat Detayları
              </h3>

              {/* Passenger Info Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ad</label>
                    <input
                      type="text"
                      placeholder="Adı"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Soyad</label>
                    <input
                      type="text"
                      placeholder="Soyadı"
                      value={passengerSurname}
                      onChange={(e) => setPassengerSurname(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">T.C. Kimlik No</label>
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="11 haneli kimlik no"
                    value={tcNo}
                    onChange={(e) => setTcNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">E-posta</label>
                  <input
                    type="email"
                    placeholder="E-posta adresi"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Telefon</label>
                  <input
                    type="tel"
                    placeholder="Telefon numarası"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Price Details */}
              <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Seçilen Koltuklar:</span>
                  <span className="font-bold text-white">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Seçilmedi'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Bilet Fiyatı:</span>
                  <span className="font-bold text-white">{selectedTicket.price} TL</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-slate-800/50 pt-2.5">
                  <span className="text-white font-bold">Toplam Tutar:</span>
                  <span className="text-lg font-black text-blue-400">{totalPrice} TL</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoToPayment}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2"
              >
                <span>Ödeme Adımına Geç</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Detail;
