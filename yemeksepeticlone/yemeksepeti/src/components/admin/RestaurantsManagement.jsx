import React, { useState, useCallback } from 'react';
import DataTable from '../common/DataTable';
import RestaurantForm from './RestaurantForm';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';
import { Plus, X } from 'lucide-react';

const RestaurantsManagement = React.memo(({ 
  restaurants, 
  categories, 
  onAddRestaurant, 
  onDeleteRestaurant,
  onToggleRestaurantStatus 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  const handleDeleteClick = useCallback((id) => {
    setRestaurantToDelete(id);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (restaurantToDelete) {
      onDeleteRestaurant(restaurantToDelete);
    }
    setIsConfirmOpen(false);
    setRestaurantToDelete(null);
  }, [restaurantToDelete, onDeleteRestaurant]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmOpen(false);
    setRestaurantToDelete(null);
  }, []);

  const columns = [
    {
      header: 'Görsel',
      key: 'image',
      render: (item) => (
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 object-cover rounded-lg border border-[#2e303a]"
        />
      ),
    },
    { header: 'Restoran Adı', key: 'name' },
    { header: 'Kategori', key: 'category' },
    { header: 'Puan', key: 'rating' },
    { header: 'Teslimat Süresi', key: 'deliveryTime' },
    {
      header: 'Durum',
      key: 'status',
      render: (item) => {
        const isActive = item.status !== 'passive';
        return (
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            isActive 
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {isActive ? 'Aktif' : 'Pasif'}
          </span>
        );
      }
    },
    {
      header: 'İşlemler',
      key: 'actions',
      render: (item) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => onToggleRestaurantStatus(item)}
            variant="secondary"
            size="xs"
          >
            {item.status === 'passive' ? 'Etkinleştir' : 'Pasife Al'}
          </Button>
          <Button
            onClick={() => handleDeleteClick(item.id)}
            variant="danger"
            size="xs"
          >
            Sil
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header and Toggle */}
      <div className="flex justify-between items-center text-left">
        <div>
          <h3 className="text-xl font-bold text-white">Restoran Yönetimi</h3>
          <p className="text-gray-400 text-xs mt-1">Sistemdeki restoran kayıtlarını ekleyin, kaldırın veya durumlarını değiştirin.</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'secondary' : 'primary'}
          size="sm"
          className="flex items-center space-x-1"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showForm ? 'İptal Et' : 'Yeni Restoran'}</span>
        </Button>
      </div>

      {/* Form toggle */}
      {showForm && (
        <RestaurantForm
          onSubmit={(data) => {
            onAddRestaurant(data);
            setShowForm(false);
          }}
          categories={categories}
        />
      )}

      {/* Restaurants List */}
      <DataTable
        columns={columns}
        data={restaurants}
        searchPlaceholder="Restoran adı ara..."
        filterKey="name"
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Restoranı Sil"
        message="Bu restoranı sistemden silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve restorana ait tüm yemekler de etkilenebilir."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
      />

    </div>
  );
});

RestaurantsManagement.displayName = 'RestaurantsManagement';

export default RestaurantsManagement;
