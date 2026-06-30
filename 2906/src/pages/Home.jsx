import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchCriteria, fetchTickets } from '../store/ticketSlice';
import { Bus, Plane, Calendar, MapPin, ArrowRight, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('bus'); // 'bus' or 'flight'
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      setValidationError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (from.toLowerCase() === to.toLowerCase()) {
      setValidationError('Kalkış ve varış noktaları aynı olamaz.');
      return;
    }
    setValidationError('');
    dispatch(setSearchCriteria({ from, to, date, type: activeTab }));
    navigate('/filter');
  };

  const handleQuickSearch = (quickFrom, quickTo, quickType) => {
    // Set date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    
    dispatch(setSearchCriteria({ 
      from: quickFrom, 
      to: quickTo, 
      date: dateString, 
      type: quickType 
    }));
    navigate('/filter');
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[550px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95)), url('/hero-bg.png')` }}
      >
        <div className="container mx-auto px-4 text-center z-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-md">
            Hayalindeki Seyahati <span className="text-blue-400">Keşfet</span>
          </h1>
          <p className="text-lg text-slate-200 mb-8 max-w-xl mx-auto drop-shadow">
            Otobüs ve uçak biletlerini en uygun fiyatlarla anında karşılaştır, güvenle satın al.
          </p>

          {/* Search Box */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl text-left">
            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-slate-800 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab('bus')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'bus' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Bus className="h-4 w-4" />
                <span>Otobüs Bileti</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('flight')}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'flight' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Plane className="h-4 w-4" />
                <span>Uçak Bileti</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nereden</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Şehir adı yazın"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nereye</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Şehir adı yazın"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gidiş Tarihi</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
              >
                <span>Bilet Bul</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {validationError && (
              <p className="mt-4 text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/50 p-2.5 rounded-lg">
                {validationError}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Popüler Rotalar */}
      <section className="py-16 container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl font-bold mb-2">Popüler Rotalar</h2>
        <p className="text-slate-400 text-sm mb-8">En çok tercih edilen hatları sizin için derledik.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Popüler 1 */}
          <div 
            onClick={() => handleQuickSearch('İstanbul', 'Ankara', 'bus')}
            className="group bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-850 px-2.5 py-1 rounded text-xs text-slate-300 font-semibold flex items-center space-x-1 border border-slate-800">
                <Bus className="h-3 w-3 text-blue-400" />
                <span>Otobüs</span>
              </span>
              <span className="text-blue-400 font-bold text-sm">600 TL'den</span>
            </div>
            <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors flex items-center">
              <span>İstanbul</span>
              <ArrowRight className="h-4 w-4 mx-2 text-slate-500" />
              <span>Ankara</span>
            </h3>
            <p className="text-xs text-slate-500 mt-2">Hemen En Uygun Seferleri Listele</p>
          </div>

          {/* Popüler 2 */}
          <div 
            onClick={() => handleQuickSearch('İstanbul', 'Ankara', 'flight')}
            className="group bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-850 px-2.5 py-1 rounded text-xs text-slate-300 font-semibold flex items-center space-x-1 border border-slate-800">
                <Plane className="h-3 w-3 text-blue-400" />
                <span>Uçak</span>
              </span>
              <span className="text-blue-400 font-bold text-sm">1200 TL'den</span>
            </div>
            <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors flex items-center">
              <span>İstanbul</span>
              <ArrowRight className="h-4 w-4 mx-2 text-slate-500" />
              <span>Ankara</span>
            </h3>
            <p className="text-xs text-slate-500 mt-2">Hemen En Uygun Uçuşları Listele</p>
          </div>

          {/* Popüler 3 */}
          <div 
            onClick={() => handleQuickSearch('İstanbul', 'İzmir', 'flight')}
            className="group bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-850 px-2.5 py-1 rounded text-xs text-slate-300 font-semibold flex items-center space-x-1 border border-slate-800">
                <Plane className="h-3 w-3 text-blue-400" />
                <span>Uçak</span>
              </span>
              <span className="text-blue-400 font-bold text-sm">1150 TL'den</span>
            </div>
            <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors flex items-center">
              <span>İstanbul</span>
              <ArrowRight className="h-4 w-4 mx-2 text-slate-500" />
              <span>İzmir</span>
            </h3>
            <p className="text-xs text-slate-500 mt-2">Hemen En Uygun Uçuşları Listele</p>
          </div>

          {/* Popüler 4 */}
          <div 
            onClick={() => handleQuickSearch('Ankara', 'İstanbul', 'bus')}
            className="group bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-850 px-2.5 py-1 rounded text-xs text-slate-300 font-semibold flex items-center space-x-1 border border-slate-800">
                <Bus className="h-3 w-3 text-blue-400" />
                <span>Otobüs</span>
              </span>
              <span className="text-blue-400 font-bold text-sm">600 TL'den</span>
            </div>
            <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors flex items-center">
              <span>Ankara</span>
              <ArrowRight className="h-4 w-4 mx-2 text-slate-500" />
              <span>İstanbul</span>
            </h3>
            <p className="text-xs text-slate-500 mt-2">Hemen En Uygun Seferleri Listele</p>
          </div>
        </div>
      </section>

      {/* Şirket Kartları: Hakkımızda, Vizyon, Misyon */}
      <section className="bg-slate-900/40 border-y border-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold">Neden GezginBilet?</h2>
            <p className="text-slate-400 text-sm mt-2">Gezginlerin bir numaralı tercihi olmamızın nedenleri.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-6 space-y-4 shadow-md">
              <div className="bg-blue-950 border border-blue-900/50 p-3 rounded-lg w-fit text-blue-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Güvenli Ödeme</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Kredi kartı ödemeleriniz yüksek güvenlikli 256-bit SSL şifreleme altyapısı ile korunmaktadır. Bilgileriniz asla saklanmaz.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-6 space-y-4 shadow-md">
              <div className="bg-blue-950 border border-blue-900/50 p-3 rounded-lg w-fit text-blue-400">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Misyonumuz</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Her bütçeden gezginin en uygun, hızlı ve kolay yoldan seyahat biletine ulaşmasını sağlamak, seyahat planlamayı keyifli bir deneyime dönüştürmektir.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-6 space-y-4 shadow-md">
              <div className="bg-blue-950 border border-blue-900/50 p-3 rounded-lg w-fit text-blue-400">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Vizyonumuz</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Teknoloji odaklı ve kullanıcı dostu arayüzümüzü sürekli geliştirerek, bilet karşılaştırma sektöründe küresel düzeyde öncü platform olmaktır.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
