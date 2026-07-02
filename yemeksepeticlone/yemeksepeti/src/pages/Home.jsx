import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../features/restaurants/restaurantsSlice';
import { fetchProducts } from '../features/products/productsSlice';
import RestaurantCard from '../components/customer/RestaurantCard';
import ProductCard from '../components/customer/ProductCard';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Clock, Star, Utensils, ArrowRight } from 'lucide-react';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: restaurants, loading: restaurantsLoading } = useSelector((state) => state.restaurants);
  const { list: products, loading: productsLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'user') {
        navigate('/user');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchProducts());
    
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Kategoriler çekilemedi', err));
  }, [dispatch]);

  // Filtering
  const filteredRestaurants = useMemo(() => {
    const activeList = restaurants.filter((r) => r.status !== 'passive');
    return selectedCategory
      ? activeList.filter((r) => r.category.toLowerCase() === selectedCategory.toLowerCase())
      : activeList;
  }, [restaurants, selectedCategory]);

  const featuredProducts = useMemo(() => {
    return products ? products.slice(0, 4) : [];
  }, [products]);

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4A0F1C] to-[#0B0B0F] py-24 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between border border-[#2e303a]/50 shadow-2xl">
        <div className="z-10 text-left max-w-xl space-y-6">
          <span className="inline-flex items-center space-x-2 text-[#B83246] font-bold text-xs uppercase tracking-widest bg-[#7A1E2C]/10 px-3.5 py-1.5 rounded-full border border-[#7A1E2C]/20">
            <Compass size={14} className="animate-spin-slow" />
            <span>En Lezzetli Yemekler Kapınızda</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none m-0">
            Canın Ne Çekerse, <br />
            <span className="text-[#B83246]">Saniyeler İçinde</span> Yanında!
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
            Şehrindeki en seçkin restoranları keşfedin, sepetinizi dilediğiniz gibi oluşturun ve sıcacık teslim alın.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : user.role === 'customer' ? '/customer' : '/user'}
                className="inline-flex items-center space-x-2 bg-[#7A1E2C] hover:bg-[#B83246] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-red-900/30 transform hover:-translate-y-0.5"
              >
                <span>Panelime Git</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-[#7A1E2C] hover:bg-[#B83246] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-[#7A1E2C]/20 transform hover:-translate-y-0.5"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border border-gray-600 hover:border-white text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="hidden md:block w-1/3 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7A1E2C] to-[#B83246] rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
              alt="Delicious food table"
              className="relative rounded-3xl shadow-2xl border border-[#2e303a] transform rotate-1 group-hover:rotate-0 transition-transform duration-300 object-cover h-72 w-full"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white">Popüler Kategoriler</h2>
          <p className="text-gray-400 mt-2 text-sm">Aradığınız lezzete göre filtreleyin</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-[#7A1E2C] text-white border border-[#7A1E2C] shadow-lg shadow-red-950/20'
                : 'bg-[#17171C] text-gray-400 border border-[#2e303a] hover:border-gray-500 hover:text-white'
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat.name
                  ? 'bg-[#7A1E2C] text-white border border-[#7A1E2C] shadow-lg shadow-red-950/20'
                  : 'bg-[#17171C] text-gray-400 border border-[#2e303a] hover:border-gray-500 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#2e303a]/50 pb-4">
          <h2 className="text-2xl font-black text-white flex items-center space-x-2">
            <Utensils size={20} className="text-[#B83246]" />
            <span>Popüler Restoranlar</span>
          </h2>
          {selectedCategory && (
            <span className="text-[#B83246] text-xs font-bold bg-[#7A1E2C]/10 px-3 py-1.5 rounded-lg border border-[#7A1E2C]/20 uppercase">
              Kategori: {selectedCategory}
            </span>
          )}
        </div>

        {restaurantsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Skeleton variant="card" count={4} />
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <EmptyState
            icon="🏢"
            title="Restoran Bulunamadı"
            description="Bu kategoride henüz sistemimizde kayıtlı aktif restoran bulunmamaktadır."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map((res) => (
              <RestaurantCard key={res.id} restaurant={res} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="space-y-6 pt-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white">Öne Çıkan Lezzetler</h2>
          <p className="text-gray-400 mt-2 text-sm">En çok sipariş edilen sevilen lezzetler</p>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Skeleton variant="card" count={4} />
          </div>
        ) : featuredProducts.length === 0 ? (
          <EmptyState
            icon="🍕"
            title="Yemek Bulunamadı"
            description="Öne çıkan ürünler listesi yüklenemedi."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
