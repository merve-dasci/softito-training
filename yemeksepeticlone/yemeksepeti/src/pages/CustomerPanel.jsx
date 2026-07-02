import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../features/restaurants/restaurantsSlice';
import { fetchUserOrders } from '../features/orders/ordersSlice';
import { fetchUserAddresses, createAddress, deleteAddress } from '../features/addresses/addressesSlice';
import { fetchUserFavorites } from '../features/favorites/favoritesSlice';
import { createReview } from '../features/reviews/reviewsSlice';
import RestaurantCard from '../components/customer/RestaurantCard';
import PageHeader from '../components/common/PageHeader';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Store,
  Package,
  Heart,
  MapPin,
  Calendar,
  Play,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Star,
  MessageSquare,
  X
} from 'lucide-react';

function CustomerPanel() {
  const dispatch = useDispatch();

  const { list: restaurants, loading: restaurantsLoading } = useSelector((state) => state.restaurants);
  const { userOrders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { list: addressesList, loading: addressesLoading } = useSelector((state) => state.addresses);
  const { list: favoritesList } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'orders' | 'favorites' | 'addresses'
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Address creation states
  const [addressTitle, setAddressTitle] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Review modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratingSpeed, setRatingSpeed] = useState(10);
  const [ratingService, setRatingService] = useState(10);
  const [ratingTaste, setRatingTaste] = useState(10);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchRestaurants());
    if (user) {
      // Debounce orders loading to avoid json-server write locks
      const timer = setTimeout(() => {
        dispatch(fetchUserOrders(user.id));
      }, 600);

      dispatch(fetchUserAddresses(user.id));
      dispatch(fetchUserFavorites(user.id));

      api.get('/categories')
        .then((res) => setCategories(res.data))
        .catch((err) => console.error('Kategoriler çekilemedi', err));

      return () => clearTimeout(timer);
    }
  }, [dispatch, user]);

  const filteredRestaurants = useMemo(() => {
    const activeList = restaurants.filter((r) => r.status !== 'passive');
    return selectedCategory
      ? activeList.filter((r) => r.category.toLowerCase() === selectedCategory.toLowerCase())
      : activeList;
  }, [restaurants, selectedCategory]);

  const favoritedRestaurants = useMemo(() => {
    return restaurants.filter((res) => favoritesList.some((f) => String(f.restaurantId) === String(res.id)));
  }, [restaurants, favoritesList]);

  const filteredUserOrders = useMemo(() => {
    if (!user) return [];
    return userOrders.filter((o) => String(o.userId) === String(user.id));
  }, [userOrders, user]);

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressTitle || !addressDetail) {
      toast.error('Lütfen tüm adres alanlarını doldurun.');
      return;
    }

    const addressData = {
      userId: String(user.id),
      title: addressTitle,
      detail: addressDetail,
    };

    dispatch(createAddress(addressData)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success('Adres başarıyla kaydedildi.');
        setAddressTitle('');
        setAddressDetail('');
        setShowAddressForm(false);
      } else {
        toast.error('Adres eklenirken bir hata oluştu.');
      }
    });
  };

  const handleDeleteAddress = (id) => {
    dispatch(deleteAddress(id)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success('Adres silindi.');
      } else {
        toast.error('Adres silinirken bir hata oluştu.');
      }
    });
  };

  // Review modal trigger
  const handleOpenReviewModal = (order) => {
    setSelectedOrder(order);
    setRatingSpeed(10);
    setRatingService(10);
    setRatingTaste(10);
    setReviewComment('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsSubmittingReview(true);
    const reviewData = {
      restaurantId: String(selectedOrder.restaurantId),
      userId: String(user.id),
      customerName: user.name,
      ratingSpeed: Number(ratingSpeed),
      ratingService: Number(ratingService),
      ratingTaste: Number(ratingTaste),
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      // 1. Post review to db
      await dispatch(createReview(reviewData)).unwrap();

      // 2. Patch order isReviewed status
      await api.patch(`/orders/${selectedOrder.id}`, { isReviewed: true });
      
      toast.success('Değerlendirmeniz başarıyla gönderildi, teşekkürler! 🌟');
      
      // 3. Reload orders in background
      dispatch(fetchUserOrders(user.id));
      setIsReviewModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Değerlendirme kaydedilemedi.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hazırlanıyor':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Play size={12} className="animate-pulse" />
            <span>Hazırlanıyor</span>
          </span>
        );
      case 'Yolda':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Truck size={12} className="animate-bounce" />
            <span>Yolda</span>
          </span>
        );
      case 'Teslim edildi':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 size={12} />
            <span>Teslim Edildi</span>
          </span>
        );
      case 'İptal edildi':
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertTriangle size={12} />
            <span>İptal Edildi</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
            <span>{status}</span>
          </span>
        );
    }
  };

  const navActions = (
    <div className="bg-[#17171C] border border-[#2e303a] rounded-xl p-1.5 flex flex-wrap gap-1">
      <button
        onClick={() => setActiveTab('browse')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all duration-200 cursor-pointer ${
          activeTab === 'browse'
            ? 'bg-[#7A1E2C] text-white shadow-md'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Store size={14} />
        <span>Restoranlar</span>
      </button>
      
      <button
        onClick={() => setActiveTab('orders')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all duration-200 relative cursor-pointer ${
          activeTab === 'orders'
            ? 'bg-[#7A1E2C] text-white shadow-md'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Package size={14} />
        <span>Siparişlerim</span>
        {filteredUserOrders.length > 0 && (
          <span className="absolute -top-1.5 -right-1 bg-[#B83246] text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full">
            {filteredUserOrders.length}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('favorites')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all duration-200 cursor-pointer ${
          activeTab === 'favorites'
            ? 'bg-[#7A1E2C] text-white shadow-md'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Heart size={14} />
        <span>Favorilerim ({favoritesList.length})</span>
      </button>

      <button
        onClick={() => setActiveTab('addresses')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all duration-200 cursor-pointer ${
          activeTab === 'addresses'
            ? 'bg-[#7A1E2C] text-white shadow-md'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <MapPin size={14} />
        <span>Adres Defterim</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* Centralized PageHeader */}
      <PageHeader
        title="Müşteri Sipariş Paneli"
        description="Lezzetli menüleri keşfedin, favorilerinizi işaretleyin ve adreslerinizi yönetin."
        actions={navActions}
      />

      <div className="bg-[#17171C]/30 p-6 rounded-xl border border-[#2e303a]/50 min-h-[50vh]">
        
        {/* 1. TAB: BROWSE RESTAURANTS */}
        {activeTab === 'browse' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Categories Selector */}
            <div className="flex flex-wrap gap-2 pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                  selectedCategory === null
                    ? 'bg-[#7A1E2C] text-white border border-[#7A1E2C]'
                    : 'bg-[#17171C] text-gray-400 border border-[#2e303a] hover:border-gray-500 hover:text-white'
                }`}
              >
                Tüm Kategoriler
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat.name
                      ? 'bg-[#7A1E2C] text-white border border-[#7A1E2C]'
                      : 'bg-[#17171C] text-gray-400 border border-[#2e303a] hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Restaurant Grid with Skeleton support */}
            {restaurantsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Skeleton variant="card" count={4} />
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <EmptyState
                icon="🏢"
                title="Restoran Bulunamadı"
                description="Arama kriterlerinize veya kategorinize uygun aktif restoran bulunmuyor."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRestaurants.map((res) => (
                  <RestaurantCard key={res.id} restaurant={res} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. TAB: ORDERS TRACKING VIEW */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            {ordersLoading ? (
              <div className="space-y-4">
                <Skeleton variant="order-card" count={3} />
              </div>
            ) : filteredUserOrders.length === 0 ? (
              <EmptyState
                icon="🛍️"
                title="Henüz Sipariş Yok"
                description="Sistemimizde kayıtlı herhangi bir siparişiniz bulunmamaktadır. Lezzetli yemekleri keşfederek hemen sipariş verin."
                actionButton={
                  <Button onClick={() => setActiveTab('browse')} variant="primary">
                    Yemek Keşfet
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {[...filteredUserOrders].reverse().map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#17171C] border border-[#2e303a] rounded-xl p-5 hover:border-[#7A1E2C]/30 transition-all duration-200 shadow-md text-left"
                  >
                    {/* Top order summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2e303a] gap-3 mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-extrabold text-lg">{order.restaurantName}</span>
                          <span className="text-gray-500 text-xs font-bold">#Sipariş {order.id}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-gray-500 text-xs mt-1">
                          <span className="flex items-center space-x-1"><Calendar size={12} /> <span>{order.date}</span></span>
                          {order.deliveryAddress && (
                            <span className="flex items-center space-x-1 text-[11px] text-gray-400 font-bold bg-[#0B0B0F] px-2 py-0.5 rounded border border-[#2e303a]/50">
                              <MapPin size={10} className="text-[#B83246]" />
                              <span>{order.addressTitle || 'Adres'}: {order.deliveryAddress}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3.5 self-start sm:self-auto">
                        {getStatusBadge(order.status)}
                        
                        {/* Rating trigger */}
                        {order.status === 'Teslim edildi' && (
                          order.isReviewed ? (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 font-bold flex items-center space-x-1">
                              <CheckCircle2 size={10} />
                              <span>Değerlendirildi</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenReviewModal(order)}
                              className="text-xs text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition cursor-pointer"
                            >
                              <MessageSquare size={13} />
                              <span>Değerlendir</span>
                            </button>
                          )
                        )}

                        <span className="text-white font-black text-lg flex items-center">
                          <span className="text-xs text-gray-500 font-semibold mr-1">Tutar:</span>
                          <span>{order.totalPrice} TL</span>
                        </span>
                      </div>
                    </div>

                    {/* Order items lists */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sipariş İçeriği</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#0B0B0F] px-4 py-2.5 rounded-lg border border-[#2e303a]/30 text-xs">
                            <span className="text-gray-300 font-medium">
                              <strong className="text-[#B83246] mr-1.5 font-bold">{item.quantity}x</strong> 
                              <span>{item.name}</span>
                              {item.itemType === 'drink' && <span className="text-gray-500 text-[10px] ml-1">(İçecek)</span>}
                              {item.itemType === 'sauce' && <span className="text-gray-500 text-[10px] ml-1">(Sos)</span>}
                            </span>
                            <span className="text-gray-400 font-bold">{item.price * item.quantity} TL</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. TAB: FAVORITE RESTAURANTS */}
        {activeTab === 'favorites' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-white">Favori Restoranlarım</h3>
              <p className="text-gray-400 text-xs mt-1">Daha önce kalbe tıklayarak favorilerinize eklediğiniz işletmeler.</p>
            </div>

            {favoritedRestaurants.length === 0 ? (
              <EmptyState
                icon="❤️"
                title="Favori Restoranınız Yok"
                description="Henüz favori listenize eklediğiniz restoran bulunmamaktadır. Keşfetmeye başlayın!"
                actionButton={
                  <Button onClick={() => setActiveTab('browse')} variant="primary">
                    Restoranları İncele
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoritedRestaurants.map((res) => (
                  <RestaurantCard key={res.id} restaurant={res} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. TAB: ADDRESS BOOK */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex justify-between items-center border-b border-[#2e303a]/50 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white">Adres Defterim</h3>
                <p className="text-gray-400 text-xs mt-1">Kayıtlı teslimat adreslerinizi düzenleyin veya yeni adresler tanımlayın.</p>
              </div>
              <Button onClick={() => setShowAddressForm(!showAddressForm)} variant={showAddressForm ? 'secondary' : 'primary'} size="sm">
                {showAddressForm ? 'Kapat' : <span className="flex items-center"><Plus size={14} className="mr-1" /> Adres Ekle</span>}
              </Button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="space-y-4 max-w-xl bg-[#17171C] border border-[#2e303a] p-6 rounded-xl shadow-md">
                <h4 className="text-sm font-bold text-white border-b border-[#2e303a] pb-2 uppercase tracking-wider">Yeni Adres Ekle</h4>
                <FormInput
                  label="Adres Başlığı"
                  id="addressTitle"
                  value={addressTitle}
                  onChange={(e) => setAddressTitle(e.target.value)}
                  placeholder="Örn: Evim, Ofis, Annemlerin Evi"
                  required
                />
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Tam Adres Detayı</label>
                  <textarea
                    id="addressDetail"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    placeholder="Sokak, mahalle, no, daire, kat ve ilçe detaylarını giriniz."
                    className="w-full bg-[#0B0B0F] border border-[#2e303a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7A1E2C] transition min-h-[100px] resize-none"
                    required
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button type="submit">Adresi Kaydet</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowAddressForm(false)}>İptal</Button>
                </div>
              </form>
            )}

            {addressesLoading ? (
              <Skeleton variant="card" count={2} />
            ) : addressesList.length === 0 ? (
              <EmptyState
                icon="📍"
                title="Adres Kaydı Bulunmuyor"
                description="Sepette daha hızlı sipariş oluşturabilmek için hemen bir teslimat adresi tanımlayın."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addressesList.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-[#17171C] border border-[#2e303a] p-5 rounded-2xl flex justify-between items-start hover:border-gray-500 transition duration-200"
                  >
                    <div className="space-y-2">
                      <span className="inline-flex items-center space-x-1 text-xs font-black text-[#B83246] uppercase tracking-wider bg-[#7A1E2C]/10 px-2.5 py-1 rounded-lg border border-[#7A1E2C]/20">
                        <MapPin size={11} />
                        <span>{addr.title}</span>
                      </span>
                      <p className="text-gray-300 text-xs leading-relaxed font-medium">{addr.detail}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-gray-500 hover:text-red-400 p-2 rounded-lg bg-[#0B0B0F] border border-[#2e303a] transition cursor-pointer"
                      title="Adresi Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Sipariş Değerlendirme (Rating & Review) Modal overlay */}
      {isReviewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-[#0B0B0F]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#17171C] border border-[#2e303a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-left animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#2e303a] flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-1.5">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span>Siparişi Değerlendir</span>
                </h3>
                <span className="text-[10px] text-gray-500 font-bold block mt-0.5">{selectedOrder.restaurantName}</span>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 bg-[#0B0B0F] border border-[#2e303a] rounded-lg cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleSubmitReview} className="p-5 space-y-4">
              
              {/* Speed Rating Selector (1-10) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                  <span>Hız Derecesi</span>
                  <span className="text-amber-500">{ratingSpeed} / 10</span>
                </label>
                <select
                  value={ratingSpeed}
                  onChange={(e) => setRatingSpeed(Number(e.target.value))}
                  className="w-full bg-[#0B0B0F] border border-[#2e303a] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#7A1E2C] cursor-pointer"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} - {i+1 === 10 ? 'Mükemmel Hızlı' : i+1 === 1 ? 'Çok Yavaş' : `Puan: ${i+1}`}</option>
                  ))}
                </select>
              </div>

              {/* Service Rating Selector (1-10) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                  <span>Servis Kalitesi</span>
                  <span className="text-blue-400">{ratingService} / 10</span>
                </label>
                <select
                  value={ratingService}
                  onChange={(e) => setRatingService(Number(e.target.value))}
                  className="w-full bg-[#0B0B0F] border border-[#2e303a] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#7A1E2C] cursor-pointer"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} - {i+1 === 10 ? 'Mükemmel Servis' : i+1 === 1 ? 'Kötü Paketleme' : `Puan: ${i+1}`}</option>
                  ))}
                </select>
              </div>

              {/* Taste Rating Selector (1-10) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                  <span>Lezzet Derecesi</span>
                  <span className="text-emerald-500">{ratingTaste} / 10</span>
                </label>
                <select
                  value={ratingTaste}
                  onChange={(e) => setRatingTaste(Number(e.target.value))}
                  className="w-full bg-[#0B0B0F] border border-[#2e303a] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#7A1E2C] cursor-pointer"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} - {i+1 === 10 ? 'Nefis / Harika' : i+1 === 1 ? 'Tatsız / Soğuk' : `Puan: ${i+1}`}</option>
                  ))}
                </select>
              </div>

              {/* Comment text area */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Yorumunuz</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Yemek kalitesi, teslimat ve lezzet hakkındaki görüşlerinizi yazın..."
                  className="w-full bg-[#0B0B0F] border border-[#2e303a] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7A1E2C] transition min-h-[80px] resize-none"
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2 pt-2 border-t border-[#2e303a]/50">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 bg-[#7A1E2C] hover:bg-[#B83246] text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wide cursor-pointer transition disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 bg-[#0B0B0F] border border-[#2e303a] text-gray-400 hover:text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wide cursor-pointer transition"
                >
                  İptal
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default CustomerPanel;
