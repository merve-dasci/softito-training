import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookTicketSeats, clearLastBooking } from '../store/ticketSlice';
import { Bus, Plane, CreditCard, ChevronRight, CheckCircle, XCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ticket, selectedSeats, passenger, totalPrice } = location.state || {};
  const { lastBooking } = useSelector((state) => state.tickets);

  // wizard states: 'form' | 'processing' | 'success' | 'failed'
  const [step, setStep] = useState('form');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [simulateSuccess, setSimulateSuccess] = useState(true);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    return () => {
      dispatch(clearLastBooking());
    };
  }, [dispatch]);

  if (!ticket || !selectedSeats || !passenger) {
    return (
      <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm space-y-4 shadow-xl">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold">Geçersiz Oturum</h3>
          <p className="text-xs text-slate-450">Bilet veya yolcu bilgileri bulunamadı. Lütfen koltuk seçimi adımından tekrar başlayın.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all"
          >
            Sefer Arama Sayfasına Git
          </button>
        </div>
      </div>
    );
  }

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
      setValidationError('Lütfen tüm kart bilgilerini doldurun.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16 || !/^\d+$/.test(cardNumber.replace(/\s/g, ''))) {
      setValidationError('Kart numarası 16 haneli bir sayı olmalıdır.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setValidationError('Son kullanma tarihi AA/YY formatında olmalıdır.');
      return;
    }

    if (cardCvv.length !== 3 || !/^\d+$/.test(cardCvv)) {
      setValidationError('CVC / CVV kodu 3 haneli bir sayı olmalıdır.');
      return;
    }

    setStep('processing');

    // Simulate network delay
    setTimeout(() => {
      if (simulateSuccess) {
        dispatch(bookTicketSeats({
          ticket,
          seatNumbers: selectedSeats,
          user: passenger,
          totalPrice
        })).then((res) => {
          if (!res.error) {
            setStep('success');
          } else {
            setValidationError(res.payload || 'Rezervasyon kaydedilirken bir hata oluştu.');
            setStep('failed');
          }
        });
      } else {
        setStep('failed');
      }
    }, 1500);
  };

  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Breadcrumb Steps */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
          <button 
            type="button" 
            onClick={() => navigate(`/detail/${ticket.id}`)}
            className="text-slate-400 hover:text-white transition-all flex items-center space-x-1"
          >
            <span>1. Koltuk Seçimi</span>
          </button>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-700" />
          <span className="text-blue-400 font-bold">2. Güvenli Ödeme</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-700" />
          <span className={step === 'success' || step === 'failed' ? 'text-blue-400 font-bold' : 'text-slate-500'}>3. Sonuç</span>
        </div>

        {validationError && step === 'form' && (
          <div className="mb-6 bg-red-950/30 border border-red-900/50 text-red-400 p-3 rounded-lg text-sm flex items-center space-x-2">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Dynamic Wizard Step Rendering */}
        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-6 border-b border-slate-850 pb-4">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <span>Kredi / Banka Kartı ile Ödeme</span>
                </h3>

                {/* Simulating Outcome Select for Testing */}
                <div className="mb-6 bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-350 block">Ödeme Simülasyonu Sonucu</span>
                    <span className="text-[10px] text-slate-500">Test senaryosunu belirlemek için seçim yapın.</span>
                  </div>
                  <div className="flex space-x-2 bg-slate-900 p-1 border border-slate-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSimulateSuccess(true)}
                      className={`text-[10px] px-3 py-1.5 rounded-md font-bold transition-all ${
                        simulateSuccess 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Başarılı
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulateSuccess(false)}
                      className={`text-[10px] px-3 py-1.5 rounded-md font-bold transition-all ${
                        !simulateSuccess 
                          ? 'bg-red-600 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Başarısız
                    </button>
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kart Sahibi</label>
                    <input
                      type="text"
                      required
                      placeholder="Ahmet Yılmaz"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kart Numarası</label>
                    <input
                      type="text"
                      maxLength={16}
                      required
                      placeholder="1234567890123456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Son Kullanma (AA/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        required
                        placeholder="12/29"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 text-center transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        required
                        placeholder="***"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-sm text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 text-center transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 bg-slate-950 p-3 border border-slate-850 rounded-xl mt-4">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Kart bilgileriniz PCI-DSS standartları ile şifrelenir ve asla kaydedilmez.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/detail/${ticket.id}`)}
                      className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-semibold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Koltuk Seçimine Dön</span>
                    </button>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-500/20"
                    >
                      Ödemeyi Tamamla
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Reservation Summary */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-3">
                  Rezervasyon Özeti
                </h3>

                {/* Route Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-blue-400">
                      {ticket.type === 'bus' ? <Bus className="h-5 w-5" /> : <Plane className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{ticket.company}</h4>
                      <p className="text-[10px] text-slate-500 uppercase">{ticket.date} &bull; {ticket.time}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Güzergah:</span>
                    <span className="font-bold text-slate-350">{ticket.departure} &rarr; {ticket.arrival}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Yolcu:</span>
                    <span className="font-bold text-slate-350">{passenger.name} {passenger.surname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Koltuk(lar):</span>
                    <span className="font-bold text-blue-400">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-850/80 pt-2 mt-2">
                    <span className="text-slate-450 font-bold">Toplam Tutar:</span>
                    <span className="text-base font-black text-emerald-400">{totalPrice} TL</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {step === 'processing' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-12 shadow-2xl text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Ödeme İşleniyor</h3>
              <p className="text-xs text-slate-450">Banka ile güvenli bağlantı kuruluyor, lütfen sayfayı kapatmayın...</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Ödemeniz Başarılı!</h3>
              <p className="text-sm text-slate-400">Biletiniz başarıyla oluşturuldu ve kaydınız tamamlandı.</p>
            </div>

            {lastBooking && (
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-850 pb-2">
                  <span className="text-slate-450">Bilet Kodu (PNR):</span>
                  <span className="font-bold text-white tracking-wider uppercase font-mono text-sm">
                    GB{lastBooking.id.substring(0, 6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Yolcu:</span>
                  <span className="font-bold text-white">{lastBooking.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Güzergah:</span>
                  <span className="font-bold text-white">{lastBooking.departure} &bull; {lastBooking.arrival}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Tarih & Saat:</span>
                  <span className="font-bold text-white">{lastBooking.date} &bull; {lastBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Koltuk(lar):</span>
                  <span className="font-bold text-blue-400">{lastBooking.seatsBooked.join(', ')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-850 pt-2">
                  <span className="text-slate-450 font-bold">Toplam Tutar:</span>
                  <span className="font-bold text-emerald-400">{lastBooking.pricePaid} TL</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-blue-500/10"
            >
              Anasayfaya Dön
            </button>
          </div>
        )}

        {step === 'failed' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Ödemeniz Başarısız!</h3>
              <p className="text-sm text-slate-400">İşleminiz banka tarafından reddedildi veya simülasyon başarısız olarak seçildi.</p>
            </div>

            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 text-xs text-red-300 text-left">
              Hata Detayı: {validationError || 'İşlem banka tarafından onaylanmadı (Yetersiz bakiye / Geçersiz kart bilgisi).'}
              <br className="my-1" />
              <span className="text-[10px] text-red-400 block mt-1">Öneri: Kart bilgiilerinizi kontrol edin ya da simülasyon ayarını "Başarılı" yaparak yeniden deneyin.</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValidationError('');
                  setStep('form');
                }}
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-350 font-semibold py-3 px-4 rounded-xl text-xs transition-all"
              >
                Yeniden Dene
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md"
              >
                Anasayfaya Git
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Payment;
