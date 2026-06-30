import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, addTicket, updateTicket, deleteTicket } from '../store/ticketSlice';
import { Bus, Plane, Plus, Trash2, Edit3, AlertCircle, Calendar, Clock, MapPin, TrendingUp, CheckCircle, RefreshCw } from 'lucide-react';

const Admin = () => {
  const dispatch = useDispatch();
  const { list: tickets, loading } = useSelector((state) => state.tickets);

  // Form State
  const [company, setCompany] = useState('');
  const [type, setType] = useState('bus');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  // UI state
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const generateSeats = (type) => {
    if (type === 'bus') {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        number: i + 1,
        status: 'available'
      }));
    } else {
      const columns = ['A', 'B', 'C', 'D'];
      const seats = [];
      let idCounter = 1;
      for (let row = 1; row <= 6; row++) {
        for (const col of columns) {
          seats.push({
            id: idCounter++,
            number: `${row}${col}`,
            status: 'available'
          });
        }
      }
      return seats;
    }
  };

  const handleEditClick = (ticket) => {
    setEditMode(true);
    setEditingId(ticket.id);
    setCompany(ticket.company);
    setType(ticket.type);
    setDeparture(ticket.departure);
    setArrival(ticket.arrival);
    setDate(ticket.date);
    setTime(ticket.time);
    setPrice(ticket.price.toString());
    setDuration(ticket.duration);
    setValidationError('');
    setSuccessMsg('');
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Bu seferi silmek istediğinizden emin misiniz?')) {
      dispatch(deleteTicket(id)).then((res) => {
        if (!res.error) {
          setSuccessMsg('Sefer başarıyla silindi.');
          setTimeout(() => setSuccessMsg(''), 3000);
        }
      });
    }
  };

  const resetForm = () => {
    setCompany('');
    setType('bus');
    setDeparture('');
    setArrival('');
    setDate('');
    setTime('');
    setPrice('');
    setDuration('');
    setEditMode(false);
    setEditingId(null);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    if (!company || !departure || !arrival || !date || !time || !price || !duration) {
      setValidationError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setValidationError('Fiyat geçerli ve sıfırdan büyük bir sayı olmalıdır.');
      return;
    }

    if (editMode) {
      const existingTicket = tickets.find((t) => t.id === editingId);
      if (!existingTicket) {
        setValidationError('Güncellenecek sefer bulunamadı.');
        return;
      }

      // If type has changed, regenerate seats. Otherwise, keep existing seat statuses.
      const finalSeats = existingTicket.type === type ? existingTicket.seats : generateSeats(type);

      const updatedTicketData = {
        ...existingTicket,
        company,
        type,
        departure,
        arrival,
        date,
        time,
        price: Number(price),
        duration,
        seats: finalSeats
      };

      dispatch(updateTicket(updatedTicketData)).then((res) => {
        if (!res.error) {
          setSuccessMsg('Sefer başarıyla güncellendi.');
          resetForm();
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          setValidationError(res.payload || 'Güncelleme hatası oluştu.');
        }
      });
    } else {
      const newTicketData = {
        id: 't' + Date.now().toString(),
        company,
        type,
        departure,
        arrival,
        date,
        time,
        price: Number(price),
        duration,
        seats: generateSeats(type)
      };

      dispatch(addTicket(newTicketData)).then((res) => {
        if (!res.error) {
          setSuccessMsg('Sefer başarıyla eklendi.');
          resetForm();
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          setValidationError(res.payload || 'Ekleme hatası oluştu.');
        }
      });
    }
  };

  // Metrics
  const totalTrips = tickets.length;
  const totalBuses = tickets.filter((t) => t.type === 'bus').length;
  const totalFlights = tickets.filter((t) => t.type === 'flight').length;

  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] py-8 font-sans">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-slate-850 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <span>Sefer Yönetim Paneli</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Sistemdeki tüm otobüs ve uçak seferlerini buradan yönetebilirsiniz.</p>
          </div>
          {editMode && (
            <button
              onClick={resetForm}
              className="mt-4 md:mt-0 bg-slate-900 border border-slate-800 hover:bg-slate-850 px-4 py-2 rounded-xl text-xs font-semibold text-slate-350 transition-all"
            >
              Yeni Sefer Ekleme Moduna Dön
            </button>
          )}
        </div>

        {/* Status Messages */}
        {validationError && (
          <div className="mb-6 bg-red-950/20 border border-red-900/50 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 bg-emerald-950/20 border border-emerald-900/50 text-emerald-450 p-4 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dashboard Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Toplam Sefer Sayısı</span>
              <span className="text-3xl font-black text-white">{loading ? '...' : totalTrips}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-blue-400">
              <RefreshCw className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Toplam Otobüs</span>
              <span className="text-3xl font-black text-white">{loading ? '...' : totalBuses}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-blue-400">
              <Bus className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Toplam Uçak</span>
              <span className="text-3xl font-black text-white">{loading ? '...' : totalFlights}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-blue-400">
              <Plane className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Form Side */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-3 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-400" />
              <span>{editMode ? 'Sefer Bilgilerini Düzenle' : 'Yeni Sefer Tanımla'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Firma Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Kamil Koç, THY"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Sefer Tipi</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="bus">Otobüs</option>
                  <option value="flight">Uçak</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nereden</label>
                  <input
                    type="text"
                    placeholder="Kalkış Şehri"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Nereye</label>
                  <input
                    type="text"
                    placeholder="Varış Şehri"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Tarih</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Saat</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Fiyat (TL)</label>
                  <input
                    type="number"
                    placeholder="Bilet Ücreti"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Süre (Örn: 6h 30m)</label>
                  <input
                    type="text"
                    placeholder="Süre"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2.5 px-4 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {editMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-1/2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-350 font-semibold py-3 px-4 rounded-xl text-xs transition-all"
                  >
                    Vazgeç
                  </button>
                )}
                <button
                  type="submit"
                  className={`font-semibold py-3 px-4 rounded-xl text-xs transition-all shadow-md ${
                    editMode 
                      ? 'w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10' 
                      : 'w-full bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                  }`}
                >
                  {editMode ? 'Güncelle' : 'Sefer Ekle'}
                </button>
              </div>
            </form>
          </div>

          {/* List Side */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-3">
              Mevcut Seferler
            </h3>

            {loading && tickets.length === 0 ? (
              <p className="text-xs text-slate-500">Sefer bilgileri yükleniyor...</p>
            ) : tickets.length === 0 ? (
              <p className="text-xs text-slate-500">Kayıtlı sefer bulunmamaktadır.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3.5 pl-2">Firma / Tür</th>
                      <th className="pb-3.5">Güzergah</th>
                      <th className="pb-3.5">Tarih / Saat</th>
                      <th className="pb-3.5 text-right pr-6">Fiyat</th>
                      <th className="pb-3.5 text-center">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-slate-850/60 hover:bg-slate-950/20 transition-all group">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400 bg-slate-950 p-1.5 rounded-lg border border-slate-850">
                              {ticket.type === 'bus' ? <Bus className="h-3.5 w-3.5" /> : <Plane className="h-3.5 w-3.5" />}
                            </span>
                            <span className="font-bold text-slate-200">{ticket.company}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span className="text-slate-300 font-medium">
                              {ticket.departure} &rarr; {ticket.arrival}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="space-y-0.5 text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-600" />
                              <span>{ticket.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-600" />
                              <span>{ticket.time} ({ticket.duration})</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right pr-6 font-bold text-blue-400 text-sm">
                          {ticket.price} TL
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(ticket)}
                              className="p-2 rounded-lg border border-slate-800 hover:border-blue-900/50 hover:bg-blue-950/20 text-slate-400 hover:text-blue-400 transition-all"
                              title="Düzenle"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(ticket.id)}
                              className="p-2 rounded-lg border border-slate-800 hover:border-red-900/50 hover:bg-red-950/20 text-slate-400 hover:text-red-400 transition-all"
                              title="Sil"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Admin;
