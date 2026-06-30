import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../store/authSlice';
import { User, Phone, Mail, Lock, UserPlus, AlertCircle, X } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !surname || !phone || !email || !password) {
      setValidationError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    if (!termsAccepted) {
      setValidationError('Kullanım koşullarını ve KVKK metnini kabul etmelisiniz.');
      return;
    }
    setValidationError('');
    dispatch(registerUser({ name, surname, phone, email, password }));
  };

  return (
    <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem-24.5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">Kayıt Ol</h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Giriş Yapın
            </Link>
          </p>
        </div>

        {(error || validationError) && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error || validationError}</span>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ad</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ahmet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Yılmaz"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Telefon Numarası</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="tel"
                required
                placeholder="5551234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">E-posta Adresi</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="ahmet@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-start mt-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-850 rounded bg-slate-950"
              />
            </div>
            <div className="ml-3 text-xs">
              <label htmlFor="terms" className="font-medium text-slate-300">
                Kullanım koşullarını kabul ediyorum ve{' '}
                <button
                  type="button"
                  onClick={() => setShowKvkkModal(true)}
                  className="text-blue-400 hover:text-blue-300 underline font-semibold focus:outline-none"
                >
                  KVKK Aydınlatma Metni
                </button>
                'ni okudum.
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
              </span>
              {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>
      </div>

      {/* KVKK Modal */}
      {showKvkkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white">KVKK Aydınlatma Metni</h3>
              <button 
                onClick={() => setShowKvkkModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-sm text-slate-350 space-y-4 leading-relaxed">
              <p>
                <strong>GezginBilet Kişisel Verilerin İşlenmesi Aydınlatma Metni</strong>
              </p>
              <p>
                GezginBilet olarak, kişisel verilerinizin güvenliğine önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu sıfatıyla hareket etmekteyiz.
              </p>
              <p>
                <strong>1. Kişisel Verilerin Hangi Amaçla İşleneceği:</strong>
                <br />
                Kayıt formunda doldurduğunuz Ad, Soyad, Telefon ve E-posta verileriniz, üyelik kaydının oluşturulması, bilet rezervasyon ve satın alma süreçlerinin yürütülmesi, faturalandırma işlemlerinin yapılması ve destek hizmetlerinin sağlanması amaçlarıyla işlenmektedir.
              </p>
              <p>
                <strong>2. İşlenen Kişisel Verilerin Kimlere Aktarılabileceği:</strong>
                <br />
                Kişisel verileriniz, seyahat rezervasyonlarınızın tamamlanması amacıyla ilgili otobüs veya uçak firmaları (Kamil Koç, THY, Pegasus vb.) ve yasal yükümlülüklerin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşları ile paylaşılabilecektir.
              </p>
              <p>
                <strong>3. Haklarınız:</strong>
                <br />
                Dilediğiniz zaman veri sorumlusu olarak şirketimize başvurarak verilerinizin silinmesini, güncellenmesini talep etme ve verilerinizin işlenip işlenmediğini öğrenme haklarına sahipsiniz.
              </p>
            </div>
            <div className="border-t border-slate-800 mt-6 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowKvkkModal(false);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-xl text-xs transition-all shadow-md shadow-blue-500/10"
              >
                Okudum, Onaylıyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
