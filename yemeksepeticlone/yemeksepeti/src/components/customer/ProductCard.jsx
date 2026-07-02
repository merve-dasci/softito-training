import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Sepete ürün eklemek için lütfen giriş yapın.');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Sadece müşteri (customer) hesabı ile sipariş oluşturabilirsiniz.');
      return;
    }

    // Single restaurant rule verification
    if (cartItems.length > 0 && String(cartItems[0].restaurantId) !== String(product.restaurantId)) {
      toast.error("Sepetinizde farklı bir restorana ait ürünler var. Yeni restorandan sipariş vermek için önce sepeti temizleyin.");
      return;
    }

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      restaurantId: String(product.restaurantId)
    }));
    
    toast.success(`${product.name} sepete eklendi!`);
  };

  // Only render add button for customers or non-logged-in users
  const showAddButton = !user || user.role === 'customer';

  return (
    <div className="bg-[#17171C] border border-[#2e303a] rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#7A1E2C]/50 transition-all duration-300 flex flex-col h-full animate-fadeIn">
      {/* Product Image */}
      <div className="h-44 w-full bg-gray-800 relative">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 bg-[#0B0B0F]/90 px-3 py-1 rounded-lg border border-[#2e303a]">
          <span className="text-white font-bold text-sm">{product.price} TL</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col flex-grow justify-between text-left">
        <div>
          <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h4>
          <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">{product.description || 'Nefis malzemelerle hazırlanmış lezzet.'}</p>
        </div>

        {showAddButton && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#7A1E2C] hover:bg-[#B83246] text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <ShoppingCart size={15} />
            <span>Sepete Ekle</span>
          </button>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
