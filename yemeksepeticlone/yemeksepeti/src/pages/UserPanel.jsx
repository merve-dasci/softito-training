import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import DataTable from '../components/common/DataTable';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import DashboardCards from '../components/admin/DashboardCards';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  Briefcase, Utensils, ClipboardList, TrendingUp, DollarSign, Clock, 
  Settings, Plus, Edit, Trash2, CheckCircle2, AlertTriangle, Truck, Play, X, User 
} from 'lucide-react';

function UserPanel() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  // Active view state
  const [activeTab, setActiveTab] = useState('dashboard'); // default to dashboard / summary

  // Restoran details
  const [restaurant, setRestaurant] = useState(null);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [resName, setResName] = useState('');
  const [resCategory, setResCategory] = useState('');
  const [resDeliveryTime, setResDeliveryTime] = useState('');
  const [resImage, setResImage] = useState('');

  // Products
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product Form states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirm Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Parse location queries for navigation tabs
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'menu') {
      setActiveTab('menu');
    } else if (tab === 'orders') {
      setActiveTab('orders');
    } else if (tab === 'profile') {
      setActiveTab('profile');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.search]);

  // Main loader logic
  const loadRestaurantData = useCallback(async () => {
    if (!user || !user.restaurantId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // 1. Fetch Restaurant details
      const resData = await api.get(`/restaurants/${user.restaurantId}`);
      setRestaurant(resData.data);
      setResName(resData.data.name);
      setResCategory(resData.data.category);
      setResDeliveryTime(resData.data.deliveryTime);
      setResImage(resData.data.image);

      // 2. Fetch Products
      const prodData = await api.get(`/products?restaurantId=${user.restaurantId}`);
      const filteredProds = prodData.data.filter(
        (p) => String(p.restaurantId) === String(user.restaurantId)
      );
      setProducts(filteredProds);

      // 3. Fetch Orders
      const orderData = await api.get('/orders');
      const filteredOrders = orderData.data.filter(
        (o) => String(o.restaurantId) === String(user.restaurantId)
      );
      setOrders(filteredOrders);

      // 4. Fetch Categories
      const categoriesData = await api.get('/categories');
      setCategories(categoriesData.data);
    } catch (err) {
      console.error(err);
      toast.error('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRestaurantData();
  }, [loadRestaurantData]);

  // Tab change handler
  const handleTabChange = (tabName) => {
    navigate(`/user?tab=${tabName}`);
  };

  // Restoran Info update handler
  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    if (!resName) {
      toast.error('İşletme adı boş olamaz.');
      return;
    }

    try {
      const updatedRes = await api.put(`/restaurants/${user.restaurantId}`, {
        ...restaurant,
        name: resName,
        category: resCategory,
        deliveryTime: resDeliveryTime,
        image: resImage
      });
      setRestaurant(updatedRes.data);
      setIsEditingRestaurant(false);
      toast.success('İşletme bilgileri güncellendi.');
    } catch (err) {
      console.error(err);
      toast.error('Güncelleme sırasında hata oluştu.');
    }
  };

  // Product Add / Update handler
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice) {
      toast.error('Ürün adı ve fiyat alanları zorunludur.');
      return;
    }

    try {
      if (editingProduct) {
        // Edit Product
        const response = await api.put(`/products/${editingProduct.id}`, {
          ...editingProduct,
          name: prodName,
          price: Number(prodPrice),
          description: prodDescription,
          image: prodImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
        });
        setProducts(products.map((p) => p.id === editingProduct.id ? response.data : p));
        toast.success('Ürün başarıyla güncellendi.');
      } else {
        // Add Product (automatically attaches restaurantId from user profile)
        const response = await api.post('/products', {
          restaurantId: String(user.restaurantId),
          name: prodName,
          price: Number(prodPrice),
          description: prodDescription,
          image: prodImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
        });
        setProducts([...products, response.data]);
        toast.success('Ürün başarıyla menüye eklendi.');
      }
      
      // Reset form
      setShowProductForm(false);
      setEditingProduct(null);
      setProdName('');
      setProdPrice('');
      setProdDescription('');
      setProdImage('');
    } catch (err) {
      console.error(err);
      toast.error('Ürün kaydedilemedi.');
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdDescription(prod.description || '');
    setProdImage(prod.image || '');
    setShowProductForm(true);
  };

  const handleDeleteProductClick = (id) => {
    setProductToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete}`);
      setProducts(products.filter((p) => p.id !== productToDelete));
      toast.success('Ürün başarıyla silindi.');
    } catch (err) {
      console.error(err);
      toast.error('Ürün silinirken hata oluştu.');
    } finally {
      setIsConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  // Order status update handler
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map((o) => o.id === orderId ? response.data : o));
      toast.success(`Sipariş durumu "${newStatus}" olarak güncellendi.`);
    } catch (err) {
      console.error(err);
      toast.error('Sipariş durumu güncellenemedi.');
    }
  };

  // Memoized stats counts
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const activeOrders = orders.filter((o) => o.status === 'Hazırlanıyor' || o.status === 'Yolda').length;
    const totalRevenue = orders
      .filter((o) => o.status === 'Teslim edildi')
      .reduce((sum, o) => sum + (parseFloat(o.totalPrice) || 0), 0);

    return { totalProducts, totalOrders, activeOrders, totalRevenue };
  }, [products, orders]);

  // DataTable columns for menu management
  const productColumns = [
    {
      header: 'Görsel',
      key: 'image',
      render: (item) => (
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 object-cover rounded-lg border border-[#2e303a]"
        />
      )
    },
    { header: 'Ürün Adı', key: 'name' },
    { header: 'Açıklama', key: 'description' },
    {
      header: 'Fiyat',
      key: 'price',
      render: (item) => <span className="font-extrabold text-[#B83246]">{item.price} TL</span>
    },
    {
      header: 'İşlemler',
      key: 'actions',
      render: (item) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEditProductClick(item)} variant="secondary" size="xs">
            <Edit size={12} className="mr-1" /> Düzenle
          </Button>
          <Button onClick={() => handleDeleteProductClick(item.id)} variant="danger" size="xs">
            <Trash2 size={12} className="mr-1" /> Sil
          </Button>
        </div>
      )
    }
  ];

  // DataTable columns for incoming orders
  const orderColumns = [
    { header: 'Sipariş ID', key: 'id', render: (item) => <span className="font-mono text-gray-500">#{item.id}</span> },
    { header: 'Müşteri', key: 'customerName' },
    {
      header: 'Tutar',
      key: 'totalPrice',
      render: (item) => <span className="font-extrabold text-white">{item.totalPrice} TL</span>
    },
    {
      header: 'Sipariş Detayı',
      key: 'items',
      render: (item) => (
        <div className="text-xs space-y-1">
          {item.items.map((prod, idx) => (
            <div key={idx} className="text-gray-400">
              <strong className="text-[#B83246]">{prod.quantity}x</strong> {prod.name}
            </div>
          ))}
        </div>
      )
    },
    {
      header: 'Sipariş Durumu',
      key: 'status',
      render: (item) => (
        <FormSelect
          value={item.status}
          onChange={(e) => handleOrderStatusChange(item.id, e.target.value)}
          options={[
            { value: 'Hazırlanıyor', label: 'Hazırlanıyor' },
            { value: 'Yolda', label: 'Yolda' },
            { value: 'Teslim edildi', label: 'Teslim edildi' },
            { value: 'İptal edildi', label: 'İptal edildi' }
          ]}
          className="text-xs max-w-[140px] bg-[#0B0B0F]"
        />
      )
    }
  ];

  const getTabButtonClass = (tabName) => {
    return `flex items-center space-x-2 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition-all ${
      activeTab === tabName
        ? 'bg-[#7A1E2C] text-white shadow-md'
        : 'text-gray-400 hover:text-white hover:bg-gray-800/20'
    }`;
  };

  const navActions = (
    <div className="bg-[#17171C] border border-[#2e303a] rounded-xl p-1.5 flex space-x-1">
      <button onClick={() => handleTabChange('dashboard')} className={getTabButtonClass('dashboard')}>
        <TrendingUp size={14} />
        <span>İşletme Özeti</span>
      </button>
      <button onClick={() => handleTabChange('menu')} className={getTabButtonClass('menu')}>
        <Utensils size={14} />
        <span>Menü Yönetimi</span>
      </button>
      <button onClick={() => handleTabChange('orders')} className={getTabButtonClass('orders')}>
        <ClipboardList size={14} />
        <span>Gelen Siparişler</span>
      </button>
      <button onClick={() => handleTabChange('profile')} className={getTabButtonClass('profile')}>
        <Settings size={14} />
        <span>Restoran Bilgilerim</span>
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <PageHeader title="Restoran / Cafe İşletme Paneli" description="Veriler yükleniyor..." />
        <Skeleton variant="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Restoran / Cafe İşletme Paneli"
        description="İşletmenize ait menüyü, ürünleri ve gelen siparişleri yönetin."
        actions={navActions}
      />

      {/* TABS CONTENT PANELS */}
      <div className="bg-[#17171C]/30 p-6 rounded-xl border border-[#2e303a]/50 min-h-[50vh]">
        
        {/* 1. İŞLETME ÖZETİ TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div>
              <h3 className="text-xl font-bold text-white">İşletme Genel Raporu</h3>
              <p className="text-gray-400 text-xs mt-1">İşletmenize ait sipariş istatistiklerini ve finansal özetinizi takip edin.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Toplam Ürün" value={stats.totalProducts} icon={<Utensils size={20} className="text-[#B83246]" />} />
              <StatCard title="Toplam Sipariş" value={stats.totalOrders} icon={<ClipboardList size={20} className="text-[#B83246]" />} />
              <StatCard title="Aktif Siparişler" value={stats.activeOrders} icon={<Clock size={20} className="text-[#B83246]" />} />
              <StatCard title="Toplam Gelir" value={`${stats.totalRevenue} TL`} icon={<DollarSign size={20} className="text-[#B83246]" />} />
            </div>

            <DashboardCards orders={orders} />
          </div>
        )}

        {/* 2. RESTORAN BİLGİLERİM TAB */}
        {activeTab === 'profile' && restaurant && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex justify-between items-center pb-4 border-b border-[#2e303a]">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Settings size={18} className="text-[#B83246]" />
                <span>İşletme Detayları</span>
              </h3>
              <Button onClick={() => setIsEditingRestaurant(!isEditingRestaurant)} variant={isEditingRestaurant ? 'secondary' : 'primary'} size="sm">
                {isEditingRestaurant ? 'Kapat' : 'Restoran Bilgilerini Düzenle'}
              </Button>
            </div>

            {isEditingRestaurant ? (
              <form onSubmit={handleUpdateRestaurant} className="space-y-4 max-w-xl bg-[#17171C] border border-[#2e303a] p-6 rounded-xl shadow-md">
                <FormInput
                  label="İşletme Adı"
                  id="resName"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  required
                />
                <FormSelect
                  label="Kategori"
                  id="resCategory"
                  value={resCategory}
                  onChange={(e) => setResCategory(e.target.value)}
                  options={[
                    { value: 'Burger', label: 'Burger' },
                    { value: 'Pizza', label: 'Pizza' },
                    { value: 'Döner', label: 'Döner' },
                    { value: 'Kebap', label: 'Kebap' },
                    { value: 'Tatlı', label: 'Tatlı' },
                  ]}
                />
                <FormInput
                  label="Teslimat Süresi"
                  id="resDeliveryTime"
                  value={resDeliveryTime}
                  onChange={(e) => setResDeliveryTime(e.target.value)}
                />
                <FormInput
                  label="Görsel URL"
                  id="resImage"
                  value={resImage}
                  onChange={(e) => setResImage(e.target.value)}
                />
                <Button type="submit" variant="primary">Kaydet</Button>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full md:w-64 h-48 object-cover rounded-xl border border-[#2e303a] shadow-md"
                />
                <div className="space-y-4 text-left flex-grow">
                  <div>
                    <h2 className="text-3xl font-black text-white">{restaurant.name}</h2>
                    <span className="inline-flex items-center text-xs font-bold bg-[#7A1E2C]/20 border border-[#7A1E2C]/40 text-[#B83246] px-2.5 py-1 rounded-md uppercase tracking-wider mt-2">
                      {restaurant.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 max-w-sm">
                    <div className="bg-[#0B0B0F] p-3 rounded-lg border border-[#2e303a]/50">
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Ortalama Süre</span>
                      <span className="text-white font-bold text-sm">{restaurant.deliveryTime}</span>
                    </div>
                    <div className="bg-[#0B0B0F] p-3 rounded-lg border border-[#2e303a]/50">
                      <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Değerlendirme Puanı</span>
                      <span className="text-white font-bold text-sm">⭐ {restaurant.rating || '4.5'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. MENU / PRODUCT MANAGEMENT TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">Menü / Ürün Yönetimi</h3>
                <p className="text-gray-400 text-xs mt-1">İşletmenizin menüsündeki tüm ürünleri ekleyin, düzenleyin veya kaldırın.</p>
              </div>
              <Button onClick={() => setShowProductForm(!showProductForm)} variant={showProductForm ? 'secondary' : 'primary'} size="sm">
                {showProductForm ? 'İptal Et' : <span className="flex items-center"><Plus size={14} className="mr-1" /> Ürün Ekle</span>}
              </Button>
            </div>

            {showProductForm && (
              <form onSubmit={handleSaveProduct} className="space-y-4 max-w-xl bg-[#17171C] border border-[#2e303a] p-6 rounded-xl shadow-md">
                <h4 className="text-sm font-bold text-white border-b border-[#2e303a] pb-2 uppercase tracking-wider">
                  {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h4>
                
                <FormInput
                  label="Yemek / Ürün Adı"
                  id="prodName"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Örn: Double Cheese Burger"
                  required
                />
                
                <FormInput
                  label="Fiyat (TL)"
                  id="prodPrice"
                  type="number"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  placeholder="Örn: 220"
                  required
                />

                <FormInput
                  label="Açıklama / Malzemeler"
                  id="prodDescription"
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Sos, yeşillik, cheddar peyniri vb."
                />

                <FormInput
                  label="Ürün Görsel URL"
                  id="prodImage"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://gorsel-linki.com"
                />

                <div className="flex space-x-2 pt-2">
                  <Button type="submit" variant="primary">Kaydet</Button>
                  <Button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }} variant="secondary">İptal</Button>
                </div>
              </form>
            )}

            <DataTable
              columns={productColumns}
              data={products}
              searchPlaceholder="Yemek ara..."
              filterKey="name"
            />
          </div>
        )}

        {/* 4. GELEN SİPARİŞLER TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <h3 className="text-xl font-bold text-white">Gelen Siparişler</h3>
              <p className="text-gray-400 text-xs mt-1">İşletmenize gelen sipariş taleplerini takip edin ve durumlarını güncelleyin.</p>
            </div>

            {/* Active Orders Sub-section */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-[#2e303a]/50 pb-2">
                Aktif Siparişler ({orders.filter((o) => o.status === 'Hazırlanıyor' || o.status === 'Yolda').length})
              </h4>
              <DataTable
                columns={orderColumns}
                data={orders.filter((o) => o.status === 'Hazırlanıyor' || o.status === 'Yolda')}
                searchPlaceholder="Müşteri adı ara..."
                filterKey="customerName"
              />
            </div>

            {/* Past Orders Sub-section */}
            <div className="space-y-3 pt-4">
              <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider border-b border-[#2e303a]/50 pb-2">
                Geçmiş Siparişler ({orders.filter((o) => o.status === 'Teslim edildi' || o.status === 'İptal edildi').length})
              </h4>
              <DataTable
                columns={orderColumns}
                data={orders.filter((o) => o.status === 'Teslim edildi' || o.status === 'İptal edildi')}
                searchPlaceholder="Müşteri adı ara..."
                filterKey="customerName"
              />
            </div>
          </div>
        )}

      </div>

      {/* Confirm deletion modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Yemeği Menüden Kaldır"
        message="Bu yemeği menünüzden tamamen kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
      />

    </div>
  );
}

export default UserPanel;
