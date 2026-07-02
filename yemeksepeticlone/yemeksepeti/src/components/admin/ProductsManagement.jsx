import React, { useState, useCallback } from 'react';
import DataTable from '../common/DataTable';
import ProductForm from './ProductForm';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';
import { Plus, X } from 'lucide-react';

const ProductsManagement = React.memo(({ products, restaurants, onAddProduct, onDeleteProduct }) => {
  const [showForm, setShowForm] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = useCallback((id) => {
    setProductToDelete(id);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (productToDelete) {
      onDeleteProduct(productToDelete);
    }
    setIsConfirmOpen(false);
    setProductToDelete(null);
  }, [productToDelete, onDeleteProduct]);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmOpen(false);
    setProductToDelete(null);
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
    { header: 'Ürün Adı', key: 'name' },
    {
      header: 'Restoran',
      key: 'restaurantId',
      render: (item) => {
        const res = restaurants.find((r) => String(r.id) === String(item.restaurantId));
        return res ? res.name : 'Bilinmeyen Restoran';
      },
    },
    {
      header: 'Fiyat',
      key: 'price',
      render: (item) => <span className="font-bold text-[#B83246]">{item.price} TL</span>,
    },
    {
      header: 'İşlemler',
      key: 'actions',
      render: (item) => (
        <Button
          onClick={() => handleDeleteClick(item.id)}
          variant="danger"
          size="sm"
        >
          Sil
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header and Toggle */}
      <div className="flex justify-between items-center text-left">
        <div>
          <h3 className="text-xl font-bold text-white">Ürün Yönetimi</h3>
          <p className="text-gray-400 text-xs mt-1">Menülerdeki tüm yemek/ürün kayıtlarını koordine edin.</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'secondary' : 'primary'}
          size="sm"
          className="flex items-center space-x-1"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showForm ? 'İptal Et' : 'Yeni Ürün'}</span>
        </Button>
      </div>

      {/* Form Toggle */}
      {showForm && (
        <ProductForm
          onSubmit={(data) => {
            onAddProduct(data);
            setShowForm(false);
          }}
          restaurants={restaurants}
        />
      )}

      {/* Products List */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Ürün adı ara..."
        filterKey="name"
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Ürünü Sil"
        message="Bu ürünü menüden silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
      />

    </div>
  );
});

ProductsManagement.displayName = 'ProductsManagement';

export default ProductsManagement;
