import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, addRestaurant, deleteRestaurant, updateRestaurant } from '../features/restaurants/restaurantsSlice';
import { fetchAllOrders, updateOrderStatus } from '../features/orders/ordersSlice';

import AdminSidebar from '../components/layout/AdminSidebar';
import PageHeader from '../components/common/PageHeader';
import StatsCards from '../components/admin/StatsCards';
import DashboardCards from '../components/admin/DashboardCards';
import OrdersManagement from '../components/admin/OrdersManagement';
import RestaurantsManagement from '../components/admin/RestaurantsManagement';
import DataTable from '../components/common/DataTable';
import { PlatformCharts } from '../components/admin/PlatformCharts';

import api from '../services/api';
import toast from 'react-hot-toast';
import { USERS } from '../constants/apiEndpoints';

function AdminPanel() {
  const dispatch = useDispatch();

  // Redux States
  const { list: restaurants } = useSelector((state) => state.restaurants);
  const { list: orders } = useSelector((state) => state.orders);

  // UI local state (Only layout and navigation states are local)
  const [activeTab, setActiveTab] = useState('restaurants'); // default tab is restaurants
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Categories cache for form dropdowns
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchRestaurants());
    dispatch(fetchAllOrders());

    // Fetch all users list for User Management tab
    setLoadingUsers(true);
    api.get(USERS)
      .then((res) => {
        setUsersList(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingUsers(false));

    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, [dispatch]);

  // Memoized handlers using useCallback to prevent children re-renders
  const handleStatusChange = useCallback((orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success(`Sipariş durumu "${newStatus}" olarak güncellendi.`);
      } else {
        toast.error('Durum güncellenirken hata oluştu.');
      }
    });
  }, [dispatch]);

  const handleAddRestaurant = useCallback((resData) => {
    dispatch(addRestaurant(resData)).then(async (action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success('Yeni restoran eklendi.');
        
        const newRes = action.payload; // Contains new restaurant { id, ownerId, ... }
        if (newRes && newRes.id && resData.ownerId) {
          try {
            await api.patch(`/users/${resData.ownerId}`, { restaurantId: String(newRes.id) });
            toast.success('Seçilen işletme sahibi bu restorana atandı.');
            
            // Refresh users list
            const userResponse = await api.get(USERS);
            setUsersList(userResponse.data);
          } catch (e) {
            console.error('İşletme sahibi güncellenemedi', e);
            toast.error('İşletme sahibi restoran ilişkisi güncellenirken hata oluştu.');
          }
        }
        
        // Refresh restaurants list
        dispatch(fetchRestaurants());
      }
    });
  }, [dispatch]);

  const handleDeleteRestaurant = useCallback((id) => {
    dispatch(deleteRestaurant(id)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success('Restoran sistemden silindi.');
      }
    });
  }, [dispatch]);

  const handleToggleRestaurantStatus = useCallback((restaurant) => {
    const newStatus = restaurant.status === 'passive' ? 'active' : 'passive';
    dispatch(updateRestaurant({ ...restaurant, status: newStatus })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success(`Restoran durumu "${newStatus === 'active' ? 'Aktif' : 'Pasif'}" olarak güncellendi.`);
      } else {
        toast.error('Restoran durumu güncellenirken hata oluştu.');
      }
    });
  }, [dispatch]);

  // User Management Columns
  const userColumns = useMemo(() => [
    { header: 'Kullanıcı ID', key: 'id', render: (item) => <span className="font-mono text-gray-500">#{item.id}</span> },
    { header: 'Ad Soyad', key: 'name' },
    { header: 'E-posta', key: 'email' },
    {
      header: 'Kullanıcı Rolü',
      key: 'role',
      render: (item) => {
        let label = 'Müşteri';
        let colorClass = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        if (item.role === 'admin') {
          label = 'Admin';
          colorClass = 'bg-red-500/10 text-red-500 border border-red-500/20';
        } else if (item.role === 'user') {
          label = 'İşletme Sahibi';
          colorClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        }
        return (
          <span className={`px-2.5 py-1 rounded text-xs font-bold ${colorClass}`}>
            {label}
          </span>
        );
      }
    }
  ], []);

  // stats calculations for platform overview
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRestaurants = restaurants.length;
    const totalCustomers = usersList.filter(u => u.role === 'customer').length;
    const totalOwners = usersList.filter(u => u.role === 'user').length;
    return { totalOrders, totalRestaurants, totalCustomers, totalOwners };
  }, [orders, restaurants, usersList]);

  return (
    <div className="space-y-6">
      
      {/* Centralized Header Component */}
      <PageHeader
        title="Yemeksepeti Ana Yönetim Paneli"
        description="Platformdaki tüm restoranları, müşterileri, ürünleri ve siparişleri yönetin."
      />

      {/* Main Grid Sidebar + View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        <div className="lg:col-span-1">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="lg:col-span-3 space-y-6 bg-[#17171C]/30 p-6 rounded-xl border border-[#2e303a]/50">
          
          {/* 1. Restoran Yönetimi */}
          {activeTab === 'restaurants' && (
            <RestaurantsManagement
              restaurants={restaurants}
              categories={categories}
              onAddRestaurant={handleAddRestaurant}
              onDeleteRestaurant={handleDeleteRestaurant}
              onToggleRestaurantStatus={handleToggleRestaurantStatus}
            />
          )}

          {/* 2. Kullanıcı Yönetimi */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div>
                <h3 className="text-xl font-bold text-white">Kullanıcı Yönetimi</h3>
                <p className="text-gray-400 text-xs mt-1">Platformdaki tüm kayıtlı admin, müşteri ve işletme sahibi profillerini listeleyin.</p>
              </div>
              <DataTable
                columns={userColumns}
                data={usersList}
                searchPlaceholder="İsim veya e-posta ara..."
                filterKey="name"
              />
            </div>
          )}

          {/* 3. Sipariş Takibi */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <OrdersManagement orders={orders} onStatusChange={handleStatusChange} />
            </div>
          )}

          {/* 4. Platform Özeti (Dashboard) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div>
                <h3 className="text-xl font-bold text-white">Platform Genel Özeti</h3>
                <p className="text-gray-400 text-xs mt-1">Platformun genel gelir, üye ve sipariş analiz raporlarını inceleyin.</p>
              </div>
              
              <StatsCards
                ordersCount={stats.totalOrders}
                restaurantsCount={stats.totalRestaurants}
                productsCount={stats.totalOwners} // Display owners count in products slot or customize
                usersCount={stats.totalCustomers} // Display customers count
              />

              <DashboardCards orders={orders} />
              <PlatformCharts orders={orders} />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminPanel;
