import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError, updateUserRestaurant } from '../features/auth/authSlice';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import api from '../services/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default is customer
  
  // Restaurant Profile state keys
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantCategory, setRestaurantCategory] = useState('Burger');
  const [deliveryTime, setDeliveryTime] = useState('25-35 dk');
  const [restaurantImage, setRestaurantImage] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && !localLoading) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'customer') {
        navigate('/customer');
      } else if (user.role === 'user') {
        navigate('/user');
      }
    }
  }, [user, navigate, localLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Lütfen tüm temel alanları doldurun.');
      return;
    }

    if (password.length < 4) {
      toast.error('Şifre en az 4 karakter olmalıdır.');
      return;
    }

    if (role === 'user' && !restaurantName) {
      toast.error('Lütfen işletme adını doldurun.');
      return;
    }

    setLocalLoading(true);

    try {
      // 1. Dispatch Register User Thunk
      const action = await dispatch(registerUser({ name, email, password, role }));
      
      if (action.meta.requestStatus === 'fulfilled') {
        const createdUser = action.payload;

        if (role === 'user') {
          // 2. Post new restaurant record
          const restaurantRes = await api.post('/restaurants', {
            ownerId: String(createdUser.id),
            name: restaurantName,
            category: restaurantCategory,
            rating: 4.5,
            deliveryTime: deliveryTime || '25-35 dk',
            image: restaurantImage || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
            status: 'active'
          });

          const createdRestaurant = restaurantRes.data;

          // 3. Patch user with restaurantId link
          await api.patch(`/users/${createdUser.id}`, {
            restaurantId: String(createdRestaurant.id)
          });

          // 4. Update local storage and Redux auth state
          dispatch(updateUserRestaurant({ restaurantId: String(createdRestaurant.id) }));
          toast.success('İşletme sahibi ve restoran kaydı başarıyla oluşturuldu!');
          navigate('/user');
        } else {
          toast.success('Kayıt başarılı! Hoş geldiniz.');
          navigate('/customer');
        }
      }
    } catch (err) {
      console.error('Kayıt sırasında hata oluştu', err);
      toast.error('Kayıt işlemi sırasında beklenmeyen bir hata oluştu.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] animate-fadeIn text-left py-6">
      <div className="bg-[#17171C] border border-[#2e303a] p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 hover:border-[#7A1E2C]/50">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center justify-center space-x-2">
            <UserPlus size={26} className="text-[#B83246]" />
            <span>Kayıt Ol</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm">Hesabınızı oluşturarak hemen başlayın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Ad Soyad"
            id="name"
            placeholder="Adınız Soyadınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          {/* Role selector */}
          <div className="text-left w-full">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Hesap Türü
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  role === 'customer'
                    ? 'border-[#7A1E2C] bg-[#7A1E2C]/10 text-[#B83246] shadow-sm'
                    : 'border-[#2e303a] bg-[#0B0B0F] text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                Müşteri Hesabı
              </button>
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  role === 'user'
                    ? 'border-[#7A1E2C] bg-[#7A1E2C]/10 text-[#B83246] shadow-sm'
                    : 'border-[#2e303a] bg-[#0B0B0F] text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                İşletme Hesabı
              </button>
            </div>
          </div>

          {/* Conditional Restaurant fields for Owner registration */}
          {role === 'user' && (
            <div className="space-y-4 pt-4 border-t border-[#2e303a]/50 animate-fadeIn">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">İşletme Detayları</span>
              
              <FormInput
                label="İşletme Adı"
                id="restaurantName"
                placeholder="Örn: Kebap sarayı"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required={role === 'user'}
              />

              <FormSelect
                label="Kategori"
                id="restaurantCategory"
                value={restaurantCategory}
                onChange={(e) => setRestaurantCategory(e.target.value)}
                options={[
                  { value: 'Burger', label: 'Burger' },
                  { value: 'Pizza', label: 'Pizza' },
                  { value: 'Döner', label: 'Döner' },
                  { value: 'Kebap', label: 'Kebap' },
                  { value: 'Tatlı', label: 'Tatlı' },
                ]}
              />

              <FormInput
                label="Ortalama Teslimat Süresi"
                id="deliveryTime"
                placeholder="Örn: 20-30 dk"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />

              <FormInput
                label="Görsel URL (Opsiyonel)"
                id="restaurantImage"
                placeholder="https://gorsel-linki.com"
                value={restaurantImage}
                onChange={(e) => setRestaurantImage(e.target.value)}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || localLoading}
            className="w-full justify-center mt-4"
          >
            {loading || localLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-400">Zaten hesabınız var mı? </span>
          <Link to="/login" className="text-[#B83246] hover:underline font-bold">
            Giriş Yapın
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
