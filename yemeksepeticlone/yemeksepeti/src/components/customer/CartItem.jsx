import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';
import ConfirmModal from '../common/ConfirmModal';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartItem = React.memo(({ item }) => {
  const dispatch = useDispatch();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleRemoveClick = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    dispatch(removeFromCart(item.cartItemId));
    toast.success(`${item.name} sepetten çıkarıldı.`);
    setIsConfirmOpen(false);
  }, [dispatch, item.cartItemId, item.name]);

  const handleCancelRemove = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  const getTypeLabel = (type) => {
    switch (type) {
      case 'drink':
        return 'İçecek';
      case 'sauce':
        return 'Sos';
      case 'product':
      default:
        return 'Menü';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'drink':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'sauce':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'product':
      default:
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#17171C] border border-[#2e303a] rounded-xl gap-4 shadow-sm hover:border-[#7A1E2C]/30 transition-colors duration-200 animate-fadeIn">
      
      {/* Product Image & Info */}
      <div className="flex items-center space-x-4 w-full sm:w-auto text-left">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
          alt={item.name}
          className="w-16 h-16 rounded-lg object-cover bg-gray-800 border border-[#2e303a]"
        />
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-white text-base line-clamp-1">{item.name}</h4>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getTypeBadgeClass(item.itemType)}`}>
              {getTypeLabel(item.itemType)}
            </span>
          </div>
          <span className="text-[#B83246] font-semibold text-sm">{item.price} TL</span>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
        
        {/* Counter */}
        <div className="flex items-center bg-[#0B0B0F] border border-[#2e303a] rounded-lg p-1">
          <button
            onClick={() => dispatch(decrementQuantity(item.cartItemId))}
            className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#17171C] transition-all"
          >
            <Minus size={14} />
          </button>
          <span className="px-3 font-semibold text-white text-sm">{item.quantity}</span>
          <button
            onClick={() => dispatch(incrementQuantity(item.cartItemId))}
            className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#17171C] transition-all"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Subtotal & Delete */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-white font-extrabold text-sm">{item.price * item.quantity} TL</div>
          </div>
          <button
            onClick={handleRemoveClick}
            className="text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors duration-200"
            title="Ürünü Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>

      </div>

      {/* Confirm deletion overlay */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Ürünü Sepetten Çıkar"
        message={`"${item.name}" ürününü sepetinizden çıkartmak istediğinize emin misiniz?`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        confirmText="Çıkar"
        cancelText="İptal"
      />

    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
