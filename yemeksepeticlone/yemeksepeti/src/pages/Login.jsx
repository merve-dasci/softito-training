import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../features/auth/authSlice';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/user');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleQuickLogin = (emailAddress) => {
    setEmail(emailAddress);
    setPassword('123456');
    toast.success('Giriş bilgileri dolduruldu!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password.length < 4) {
      toast.error('Şifre en az 4 karakter olmalıdır.');
      return;
    }

    dispatch(loginUser({ email, password })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success(`Giriş başarılı! Hoş geldin, ${action.payload.name}`);
        if (action.payload.role === 'admin') {
          navigate('/admin');
        } else if (action.payload.role === 'customer') {
          navigate('/customer');
        } else {
          navigate('/user');
        }
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] animate-fadeIn text-left">
      <div className="bg-[#17171C] border border-[#2e303a] p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 hover:border-[#7A1E2C]/50">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center space-x-2">
            <LogIn size={26} className="text-[#B83246]" />
            <span>Giriş Yap</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Lezzetli yemekler bir adım uzağınızda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="E-posta Adresi"
            id="email"
            type="email"
            placeholder="ornek@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            label="Şifre"
            id="password"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>

        {/* Demo Accounts Helper */}
        <div className="mt-6 pt-6 border-t border-[#2e303a]">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Demo Test Hesapları (Doldurmak İçin Tıkla)</h4>
          <div className="space-y-2 text-[10px] text-gray-400">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@test.com')}
              className="w-full text-left bg-[#0B0B0F] p-2.5 rounded-lg border border-[#2e303a]/50 hover:border-[#7A1E2C]/50 flex justify-between items-center transition cursor-pointer"
            >
              <div>
                <div className="font-extrabold text-[#B83246] uppercase">Admin</div>
                <div className="text-gray-300">admin@test.com / <span className="font-mono">123456</span></div>
              </div>
              <span className="text-[9px] text-gray-500 italic">Yemeksepeti ana yönetimi</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleQuickLogin('owner@test.com')}
              className="w-full text-left bg-[#0B0B0F] p-2.5 rounded-lg border border-[#2e303a]/50 hover:border-[#7A1E2C]/50 flex justify-between items-center transition cursor-pointer"
            >
              <div>
                <div className="font-extrabold text-[#B83246] uppercase">İşletme Sahibi</div>
                <div className="text-gray-300">owner@test.com / <span className="font-mono">123456</span></div>
              </div>
              <span className="text-[9px] text-gray-500 italic">Restoran/cafe paneli</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@test.com')}
              className="w-full text-left bg-[#0B0B0F] p-2.5 rounded-lg border border-[#2e303a]/50 hover:border-[#7A1E2C]/50 flex justify-between items-center transition cursor-pointer"
            >
              <div>
                <div className="font-extrabold text-[#B83246] uppercase">Müşteri</div>
                <div className="text-gray-300">customer@test.com / <span className="font-mono">123456</span></div>
              </div>
              <span className="text-[9px] text-gray-500 italic">Sipariş veren müşteri</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-400">Hesabınız yok mu? </span>
          <Link to="/register" className="text-[#B83246] hover:underline font-bold">
            Kayıt Olun
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
