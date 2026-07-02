import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantDetail, clearSelectedRestaurant } from '../features/restaurants/restaurantsSlice';
import { fetchProductsByRestaurant, clearRestaurantProducts } from '../features/products/productsSlice';
import { fetchDrinksByRestaurant, clearRestaurantDrinks } from '../features/drinks/drinksSlice';
import { fetchSaucesByRestaurant, clearRestaurantSauces } from '../features/sauces/saucesSlice';
import { fetchRestaurantReviews } from '../features/reviews/reviewsSlice';
import { fetchUserFavorites, toggleFavorite } from '../features/favorites/favoritesSlice';
import { addToCart } from '../features/cart/cartSlice';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { ArrowLeft, Star, Clock, Tag, ShoppingCart, Coffee, Flame, Heart, MessageSquare, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

function RestaurantDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedRestaurant: restaurant, loading: restaurantLoading, error: restaurantError } = useSelector(
    (state) => state.restaurants
  );
  const { restaurantProducts: products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { restaurantDrinks: drinks, loading: drinksLoading } = useSelector(
    (state) => state.drinks
  );
  const { restaurantSauces: sauces, loading: saucesLoading } = useSelector(
    (state) => state.sauces
  );
  const { list: reviewsList, loading: reviewsLoading } = useSelector(
    (state) => state.reviews
  );
  const { list: favoritesList } = useSelector(
    (state) => state.favorites
  );
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Active section tab: 'menu' | 'drinks' | 'sauces' | 'reviews'
  const [activeSection, setActiveSection] = useState('menu');

  useEffect(() => {
    dispatch(fetchRestaurantDetail(id));
    dispatch(fetchProductsByRestaurant(id));
    dispatch(fetchDrinksByRestaurant(id));
    dispatch(fetchSaucesByRestaurant(id));
    dispatch(fetchRestaurantReviews(id));

    if (user && user.role === 'customer') {
      dispatch(fetchUserFavorites(user.id));
    }

    return () => {
      dispatch(clearSelectedRestaurant());
      dispatch(clearRestaurantProducts());
      dispatch(clearRestaurantDrinks());
      dispatch(clearRestaurantSauces());
    };
  }, [dispatch, id, user]);

  const handleAddItemToCart = useCallback((item, itemType) => {
    if (!user) {
      toast.error('Sepete ürün eklemek için lütfen giriş yapın.');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Sadece müşteri (customer) hesabı ile sipariş oluşturabilirsiniz.');
      return;
    }

    // Check Tek Restoran Kuralı
    if (cartItems.length > 0 && String(cartItems[0].restaurantId) !== String(restaurant.id)) {
      toast.error("Sepetinizde farklı bir restorana ait ürünler var. Yeni restorandan sipariş vermek için önce sepeti temizleyin.");
      return;
    }

    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: String(restaurant.id),
      itemType: itemType
    }));

    toast.success(`${item.name} sepete eklendi!`);
  }, [dispatch, user, cartItems, restaurant, navigate]);

  // Favorite calculations
  const favoriteObj = useMemo(() => {
    if (!user || user.role !== 'customer') return null;
    return favoritesList.find((f) => String(f.restaurantId) === String(id));
  }, [favoritesList, user, id]);

  const isFavorited = !!favoriteObj;

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error('Restoranı favorilerinize eklemek için lütfen giriş yapın.');
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Sadece müşteri (customer) rolleri restorana favori kalbi bırakabilir.');
      return;
    }

    dispatch(toggleFavorite({
      userId: user.id,
      restaurantId: id,
      favoriteId: favoriteObj?.id
    })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        if (action.payload.isFavorite) {
          toast.success('Restoran favorilerinize eklendi! ❤️');
        } else {
          toast.success('Restoran favorilerinizden çıkarıldı.');
        }
      }
    });
  };

  // Review calculations
  const reviewsStats = useMemo(() => {
    if (reviewsList.length === 0) return null;
    let sumSpeed = 0;
    let sumService = 0;
    let sumTaste = 0;

    reviewsList.forEach((r) => {
      sumSpeed += Number(r.ratingSpeed || 0);
      sumService += Number(r.ratingService || 0);
      sumTaste += Number(r.ratingTaste || 0);
    });

    const avgSpeed = (sumSpeed / reviewsList.length).toFixed(1);
    const avgService = (sumService / reviewsList.length).toFixed(1);
    const avgTaste = (sumTaste / reviewsList.length).toFixed(1);
    const overall = ((parseFloat(avgSpeed) + parseFloat(avgService) + parseFloat(avgTaste)) / 3).toFixed(1);

    return { avgSpeed, avgService, avgTaste, overall, count: reviewsList.length };
  }, [reviewsList]);

  // Show Add to Cart button logic
  const showAddButton = !user || user.role === 'customer';

  if (restaurantLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="banner" />
        <Skeleton variant="card" count={4} />
      </div>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <EmptyState
        icon="🏢"
        title="Restoran Bulunamadı"
        description={restaurantError || 'Ulaşmak istediğiniz restoran detayları sunucuda bulunamadı.'}
        actionButton={
          <Link to="/customer" className="inline-flex bg-[#7A1E2C] hover:bg-[#B83246] text-white px-6 py-2.5 rounded-lg font-semibold transition">
            Geri Dön
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-left pb-12">
      {/* Back button with Lucide */}
      <div className="flex">
        <Link
          to="/customer"
          className="text-gray-400 hover:text-white flex items-center space-x-1.5 text-xs font-bold uppercase transition tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>Restoranlara Geri Dön</span>
        </Link>
      </div>

      {/* Restaurant Header Banner */}
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 border border-[#2e303a]/50 shadow-xl group">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/45 to-transparent" />
        
        {/* Favorite Heart Toggler inside Header */}
        {(!user || user.role === 'customer') && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-6 right-6 w-11 h-11 bg-[#17171C]/90 rounded-full border border-[#2e303a] flex items-center justify-center cursor-pointer shadow-lg transition duration-200 hover:scale-110 active:scale-95"
            title={isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <Heart
              size={18}
              className={isFavorited ? 'fill-[#B83246] text-[#B83246]' : 'text-gray-400 hover:text-[#B83246]'}
            />
          </button>
        )}

        {/* Restaurant Header Details */}
        <div className="absolute bottom-6 left-6 md:left-10 text-left space-y-3.5">
          <span className="inline-flex items-center space-x-1 bg-[#7A1E2C] text-white text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
            <Tag size={10} className="mr-1" />
            <span>{restaurant.category}</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-none m-0 tracking-tight">{restaurant.name}</h1>
          <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star size={14} fill="currentColor" />
              <span className="text-white">
                {reviewsStats ? `${reviewsStats.overall} (${reviewsStats.count} Yorum)` : `${restaurant.rating || '4.5'} Puan`}
              </span>
            </div>
            <span className="text-gray-600">|</span>
            <div className="flex items-center space-x-1.5 text-gray-300">
              <Clock size={14} />
              <span>{restaurant.deliveryTime || '25-35 dk'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu / Section selector tabs */}
      <div className="border-b border-[#2e303a]/50 pb-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 bg-[#17171C] p-1.5 rounded-xl border border-[#2e303a]/50">
          <button
            onClick={() => setActiveSection('menu')}
            className={`px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
              activeSection === 'menu'
                ? 'bg-[#7A1E2C] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Menü / Yemekler
          </button>
          <button
            onClick={() => setActiveSection('drinks')}
            className={`px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'drinks'
                ? 'bg-[#7A1E2C] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Coffee size={13} />
            <span>İçecekler</span>
          </button>
          <button
            onClick={() => setActiveSection('sauces')}
            className={`px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'sauces'
                ? 'bg-[#7A1E2C] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame size={13} />
            <span>Soslar</span>
          </button>
          <button
            onClick={() => setActiveSection('reviews')}
            className={`px-4 py-2.5 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeSection === 'reviews'
                ? 'bg-[#7A1E2C] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare size={13} />
            <span>Değerlendirmeler ({reviewsList.length})</span>
          </button>
        </div>

        {cartItems.length > 0 && String(cartItems[0].restaurantId) === String(restaurant.id) && (
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center space-x-1.5 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Bu Restorandan Sepetiniz Var</span>
          </span>
        )}
      </div>

      {/* RENDER ACTIVE TAB VIEW */}
      <div className="min-h-[40vh]">
        
        {/* 1. MENU PRODUCTS LIST */}
        {activeSection === 'menu' && (
          <div className="space-y-6">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Skeleton variant="card" count={4} />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon="🍕"
                title="Henüz Yemek Yok"
                description="Bu restoran henüz menü ürünlerini sisteme eklememiştir."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#17171C] border border-[#2e303a] rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#7A1E2C]/50 transition-all duration-300 flex flex-col h-full animate-fadeIn"
                  >
                    <div className="h-44 w-full bg-gray-800 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 right-3 bg-[#0B0B0F]/90 px-3 py-1 rounded-lg border border-[#2e303a]">
                        <span className="text-white font-bold text-sm">{product.price} TL</span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow justify-between text-left">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h4>
                        <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">{product.description || 'Nefis malzemelerle hazırlanmış lezzet.'}</p>
                      </div>
                      {showAddButton && (
                        <button
                          onClick={() => handleAddItemToCart(product, 'product')}
                          className="w-full bg-[#7A1E2C] hover:bg-[#B83246] text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <ShoppingCart size={15} />
                          <span>Sepete Ekle</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. DRINKS LIST */}
        {activeSection === 'drinks' && (
          <div className="space-y-6">
            {drinksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Skeleton variant="card" count={4} />
              </div>
            ) : drinks.length === 0 ? (
              <EmptyState
                icon="🥤"
                title="İçecek Bulunmuyor"
                description="Bu restoran için tanımlanmış içecek kaydı bulunmamaktadır."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {drinks.map((drink) => (
                  <div
                    key={drink.id}
                    className="bg-[#17171C] border border-[#2e303a] rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#7A1E2C]/50 transition-all duration-300 flex flex-col h-full animate-fadeIn"
                  >
                    <div className="h-44 w-full bg-gray-800 relative">
                      <img
                        src={drink.image}
                        alt={drink.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 right-3 bg-[#0B0B0F]/90 px-3 py-1 rounded-lg border border-[#2e303a]">
                        <span className="text-white font-bold text-sm">{drink.price} TL</span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow justify-between text-left">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{drink.name}</h4>
                        <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">Siparişinizin yanına buz gibi taze bir içecek.</p>
                      </div>
                      {showAddButton && (
                        <button
                          onClick={() => handleAddItemToCart(drink, 'drink')}
                          className="w-full bg-[#7A1E2C] hover:bg-[#B83246] text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <ShoppingCart size={15} />
                          <span>Sepete Ekle</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. SAUCES LIST */}
        {activeSection === 'sauces' && (
          <div className="space-y-6">
            {saucesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Skeleton variant="card" count={4} />
              </div>
            ) : sauces.length === 0 ? (
              <EmptyState
                icon="🍯"
                title="Sos Bulunmuyor"
                description="Bu restoran için tanımlanmış sos seçeneği bulunmamaktadır."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sauces.map((sauce) => (
                  <div
                    key={sauce.id}
                    className="bg-[#17171C] border border-[#2e303a] rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#7A1E2C]/50 transition-all duration-300 flex flex-col h-full animate-fadeIn"
                  >
                    <div className="h-44 w-full bg-gray-800 relative">
                      <img
                        src={sauce.image}
                        alt={sauce.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 right-3 bg-[#0B0B0F]/90 px-3 py-1 rounded-lg border border-[#2e303a]">
                        <span className="text-white font-bold text-sm">{sauce.price} TL</span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow justify-between text-left">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{sauce.name}</h4>
                        <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">Menü lezzetini katlayacak özel soslar.</p>
                      </div>
                      {showAddButton && (
                        <button
                          onClick={() => handleAddItemToCart(sauce, 'sauce')}
                          className="w-full bg-[#7A1E2C] hover:bg-[#B83246] text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <ShoppingCart size={15} />
                          <span>Sepete Ekle</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. REVIEWS & RATINGS LIST */}
        {activeSection === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            {reviewsLoading ? (
              <Skeleton variant="card" count={2} />
            ) : reviewsList.length === 0 ? (
              <EmptyState
                icon="💬"
                title="Henüz Değerlendirme Yok"
                description="Bu restorana henüz hiçbir müşteri yorum veya değerlendirme bırakmamıştır."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Visual Averages Summary card */}
                {reviewsStats && (
                  <div className="lg:col-span-1 bg-[#17171C] border border-[#2e303a] rounded-2xl p-6 space-y-5">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold block">Restoran Genel Puanı</span>
                      <span className="text-[#B83246] text-4xl font-black block">{reviewsStats.overall}</span>
                      <div className="flex justify-center text-yellow-400 space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < Math.round(parseFloat(reviewsStats.overall) / 2) ? 'currentColor' : 'none'} className="text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#2e303a]/50">
                      {/* Speed Progress */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-gray-400 font-bold">
                          <span>Hız</span>
                          <span className="text-white">{reviewsStats.avgSpeed} / 10</span>
                        </div>
                        <div className="w-full bg-[#0B0B0F] h-2 rounded-full overflow-hidden border border-[#2e303a]/30">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${parseFloat(reviewsStats.avgSpeed) * 10}%` }}></div>
                        </div>
                      </div>

                      {/* Service Progress */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-gray-400 font-bold">
                          <span>Servis Kalitesi</span>
                          <span className="text-white">{reviewsStats.avgService} / 10</span>
                        </div>
                        <div className="w-full bg-[#0B0B0F] h-2 rounded-full overflow-hidden border border-[#2e303a]/30">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${parseFloat(reviewsStats.avgService) * 10}%` }}></div>
                        </div>
                      </div>

                      {/* Taste Progress */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-gray-400 font-bold">
                          <span>Lezzet Derecesi</span>
                          <span className="text-white">{reviewsStats.avgTaste} / 10</span>
                        </div>
                        <div className="w-full bg-[#0B0B0F] h-2 rounded-full overflow-hidden border border-[#2e303a]/30">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${parseFloat(reviewsStats.avgTaste) * 10}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-4">
                  {reviewsList.map((review) => (
                    <div
                      key={review.id}
                      className="bg-[#17171C]/50 border border-[#2e303a]/80 p-5 rounded-2xl space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-white text-xs block">{review.customerName}</span>
                          <span className="text-[10px] text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] font-extrabold uppercase">
                          <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">Hız: {review.ratingSpeed}</span>
                          <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">Servis: {review.ratingService}</span>
                          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Lezzet: {review.ratingTaste}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-xs leading-relaxed italic">
                        "{review.comment || 'Müşteri yorum bırakmadı, sadece puan verdi.'}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default RestaurantDetail;
