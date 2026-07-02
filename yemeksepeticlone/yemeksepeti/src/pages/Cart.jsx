import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchRestaurants } from '../features/restaurants/restaurantsSlice';
import { createOrder } from '../features/orders/ordersSlice';
import { clearCart } from '../features/cart/cartSlice';
import { fetchUserAddresses, createAddress } from '../features/addresses/addressesSlice';
import CartItem from '../components/customer/CartItem';
import EmptyState from '../components/common/EmptyState';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowLeft, Trash2, CreditCard, DollarSign, MapPin, Plus } from 'lucide-react';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { list: restaurants } = useSelector((state) => state.restaurants);
  const { list: addresses } = useSelector((state) => state.addresses);

  // Address states
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showQuickAddressForm, setShowQuickAddressForm] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDetail, setQuickDetail] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery'); // default to cash on delivery
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isFlipped, setIsFlipped] = useState(false); // flips card on CVV focus

  useEffect(() => {
    dispatch(fetchRestaurants());
    if (user) {
      dispatch(fetchUserAddresses(user.id));
    }
  }, [dispatch, user]);

  // Sync default address selection
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(String(addresses[0].id));
    }
  }, [addresses, selectedAddressId]);

  // Calculate detailed totals
  const totals = useMemo(() => {
    let productTotal = 0;
    let drinkTotal = 0;
    let sauceTotal = 0;
    let totalQty = 0;

    items.forEach((item) => {
      const cost = item.price * item.quantity;
      totalQty += item.quantity;
      if (item.itemType === 'drink') {
        drinkTotal += cost;
      } else if (item.itemType === 'sauce') {
        sauceTotal += cost;
      } else {
        productTotal += cost;
      }
    });

    return { productTotal, drinkTotal, sauceTotal, totalQty };
  }, [items]);

  const handleAddQuickAddress = (e) => {
    e.preventDefault();
    if (!quickTitle || !quickDetail) {
      toast.error('Lütfen adres başlığını ve detayını girin.');
      return;
    }

    const addressData = {
      userId: String(user.id),
      title: quickTitle,
      detail: quickDetail,
    };

    dispatch(createAddress(addressData)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success('Adres kaydedildi.');
        setSelectedAddressId(String(action.payload.id));
        setQuickTitle('');
        setQuickDetail('');
        setShowQuickAddressForm(false);
      } else {
        toast.error('Adres kaydedilirken bir hata oluştu.');
      }
    });
  };

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error('Sipariş oluşturmak için lütfen giriş yapın.');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Sadece müşteri (customer) hesabı ile sipariş oluşturabilirsiniz.');
      return;
    }

    if (items.length === 0) {
      toast.error('Sepetiniz boş! Lütfen sipariş oluşturmak için sepetinize ürün ekleyin.');
      return;
    }

    // Require an address selection
    const selectedAddress = addresses.find((a) => String(a.id) === String(selectedAddressId));
    if (!selectedAddress) {
      toast.error('Lütfen teslimat adresi seçin veya yeni bir adres ekleyin.');
      return;
    }

    // Validate online payment card fields
    if (paymentMethod === 'online') {
      if (!cardName) {
        toast.error('Lütfen kart sahibinin adını girin.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Lütfen 16 haneli geçerli kart numarasını girin.');
        return;
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        toast.error('Lütfen geçerli son kullanma tarihi girin (AA/YY).');
        return;
      }
      if (cardCvv.length < 3) {
        toast.error('Lütfen 3 haneli CVV kodunu girin.');
        return;
      }
    }

    // Resolve restaurant details from the first item
    const firstItem = items[0];
    const restaurant = restaurants.find((r) => String(r.id) === String(firstItem.restaurantId));
    const restaurantName = restaurant ? restaurant.name : 'Lezzet Restoranı';

    const orderData = {
      userId: String(user.id),
      restaurantId: String(firstItem.restaurantId),
      customerName: user.name,
      restaurantName,
      paymentMethod,
      deliveryAddress: selectedAddress.detail,
      addressTitle: selectedAddress.title,
      items: items.map((item) => ({
        itemId: String(item.id),
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        itemType: item.itemType || 'product',
      })),
      totalPrice,
      status: 'Hazırlanıyor',
      date: new Date().toISOString().split('T')[0],
    };

    dispatch(createOrder(orderData)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        toast.success('Sipariş tamamlandı!');
        dispatch(clearCart());
        // Redirect to customer panel orders list
        navigate('/customer?tab=orders');
      } else {
        toast.error('Sipariş oluşturulurken bir sorun oluştu.');
      }
    });
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case 'online':
        return 'Online Kredi / Banka Kartı';
      case 'card_on_delivery':
        return 'Kapıda Kredi Kartı';
      case 'cash_on_delivery':
      default:
        return 'Kapıda Nakit';
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Sepetiniz Boş"
        description="Sepetinizde ürün bulunmamaktadır. Harika lezzetleri keşfetmek için restoranlarımıza göz atın."
        actionButton={
          <Link
            to="/customer"
            className="inline-flex items-center space-x-2 bg-[#7A1E2C] hover:bg-[#B83246] text-white px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition duration-200"
          >
            <span>Yemek Keşfet</span>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn text-left">
      
      {/* Items List, Address & Payment */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2e303a]">
          <h2 className="text-2xl font-black text-white flex items-center space-x-2">
            <ShoppingBag size={22} className="text-[#B83246]" />
            <span>Sepetim</span>
          </h2>
          <button
            onClick={() => {
              dispatch(clearCart());
              toast.success('Sepet temizlendi.');
            }}
            className="flex items-center space-x-1 text-xs font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-3.5 py-2 rounded-lg transition animate-fadeIn cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Sepeti Boşalt</span>
          </button>
        </div>

        {/* Selected Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.cartItemId} item={item} />
          ))}
        </div>

        {/* Delivery Address Section */}
        <div className="bg-[#17171C] border border-[#2e303a] rounded-2xl p-6 space-y-4 mt-6">
          <div className="flex justify-between items-center border-b border-[#2e303a]/50 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <MapPin size={18} className="text-[#B83246]" />
              <span>Teslimat Adresi</span>
            </h3>
            <button
              onClick={() => setShowQuickAddressForm(!showQuickAddressForm)}
              className="text-xs text-[#B83246] hover:text-[#e0455d] font-bold flex items-center space-x-1 cursor-pointer bg-[#7A1E2C]/10 px-3 py-1.5 rounded-lg border border-[#7A1E2C]/20 transition"
            >
              <Plus size={12} />
              <span>{showQuickAddressForm ? 'Kapat' : 'Yeni Adres Ekle'}</span>
            </button>
          </div>

          {showQuickAddressForm ? (
            <form onSubmit={handleAddQuickAddress} className="bg-[#0B0B0F] border border-[#2e303a] p-4.5 rounded-xl space-y-3.5 animate-fadeIn">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Hızlı Adres Tanımla</h4>
              <FormInput
                label="Adres Başlığı"
                id="quickTitle"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Örn: Evim, İş Yerim"
                required
              />
              <div className="space-y-1 text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Adres Detayı</label>
                <textarea
                  id="quickDetail"
                  value={quickDetail}
                  onChange={(e) => setQuickDetail(e.target.value)}
                  placeholder="Cadde, sokak, no, daire, ilçe ve şehir bilgilerini girin."
                  className="w-full bg-[#17171C] border border-[#2e303a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7A1E2C] transition min-h-[80px] resize-none"
                  required
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <Button type="submit" size="sm">Kaydet</Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowQuickAddressForm(false)}>İptal</Button>
              </div>
            </form>
          ) : addresses.length > 0 ? (
            <div className="space-y-3.5 text-xs text-gray-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddressId(String(addr.id))}
                    className={`p-4 rounded-xl border text-left transition space-y-1.5 cursor-pointer flex flex-col ${
                      String(selectedAddressId) === String(addr.id)
                        ? 'border-[#7A1E2C] bg-[#7A1E2C]/10 text-white'
                        : 'border-[#2e303a] bg-[#0B0B0F] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <span className="font-extrabold uppercase text-[#B83246] tracking-wider flex items-center space-x-1.5">
                      <MapPin size={12} />
                      <span>{addr.title}</span>
                    </span>
                    <span className="line-clamp-2 leading-relaxed text-[11px] text-gray-300">{addr.detail}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#0B0B0F] border border-[#2e303a] p-6 rounded-xl text-center space-y-3 animate-fadeIn">
              <MapPin size={32} className="text-gray-500 mx-auto" />
              <p className="text-xs text-gray-400">
                Kayıtlı teslimat adresiniz bulunmamaktadır. Siparişinizi tamamlayabilmek için lütfen yeni bir adres ekleyin.
              </p>
              <button
                type="button"
                onClick={() => setShowQuickAddressForm(true)}
                className="bg-[#7A1E2C] hover:bg-[#B83246] text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition cursor-pointer"
              >
                Adres Ekle
              </button>
            </div>
          )}
        </div>

        {/* Payment Methods selector */}
        <div className="bg-[#17171C] border border-[#2e303a] rounded-2xl p-6 space-y-4 mt-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-[#2e303a]/50 pb-3">
            <CreditCard size={18} className="text-[#B83246]" />
            <span>Ödeme Yöntemi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash_on_delivery')}
              className={`p-4 rounded-xl border text-xs font-bold uppercase transition flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-[#7A1E2C] bg-[#7A1E2C]/10 text-white'
                  : 'border-[#2e303a] bg-[#0B0B0F] text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              <DollarSign size={20} />
              <span>Kapıda Nakit</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('card_on_delivery')}
              className={`p-4 rounded-xl border text-xs font-bold uppercase transition flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                paymentMethod === 'card_on_delivery'
                  ? 'border-[#7A1E2C] bg-[#7A1E2C]/10 text-white'
                  : 'border-[#2e303a] bg-[#0B0B0F] text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              <CreditCard size={20} />
              <span>Kapıda Kredi Kartı</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('online')}
              className={`p-4 rounded-xl border text-xs font-bold uppercase transition flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                paymentMethod === 'online'
                  ? 'border-[#7A1E2C] bg-[#7A1E2C]/10 text-white'
                  : 'border-[#2e303a] bg-[#0B0B0F] text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              <CreditCard size={20} className="text-emerald-500" />
              <span>Kart İle Online Ödeme</span>
            </button>
          </div>

          {/* Render mock card fields if online payment is chosen */}
          {paymentMethod === 'online' && (
            <div className="bg-[#0B0B0F] border border-[#2e303a] p-4.5 rounded-xl space-y-4 animate-fadeIn mt-4">
              
              {/* INTERACTIVE 3D CREDIT CARD VISUALIZATION */}
              <div className={`card-container ${isFlipped ? 'flipped' : ''}`}>
                <div className="card-inner">
                  
                  {/* CARD FRONT VIEW */}
                  <div className="card-front">
                    <div className="flex justify-between items-center">
                      {/* Gold Chip Icon Mock */}
                      <div className="w-10 h-8 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-md border border-amber-600/30 flex flex-col justify-between p-1.5 shadow">
                        <div className="grid grid-cols-3 gap-0.5 w-full h-full opacity-60">
                          <span className="border-r border-b border-black/30"></span>
                          <span className="border-r border-b border-black/30"></span>
                          <span className="border-b border-black/30"></span>
                          <span className="border-r border-black/30"></span>
                          <span className="border-r border-black/30"></span>
                          <span></span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#B83246]">DELICIOUS</span>
                    </div>

                    <div className="text-lg font-bold text-center tracking-widest my-3 select-all font-mono">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <span className="text-[7px] text-gray-400 block uppercase tracking-wider">KART SAHİBİ</span>
                        <span className="text-xs font-bold uppercase tracking-wide block truncate max-w-[180px]">
                          {cardName || 'İSİM SOYİSİM'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[7px] text-gray-400 block uppercase tracking-wider">GEÇERLİLİK</span>
                        <span className="text-xs font-bold block font-mono">{cardExpiry || 'AA/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD BACK VIEW */}
                  <div className="card-back">
                    {/* Magnetic Stripe */}
                    <div className="w-full bg-[#0B0B0F] h-10 mt-2"></div>
                    
                    <div className="px-6 space-y-2 mt-4 text-left">
                      <span className="text-[7px] text-gray-400 block uppercase tracking-wider">GÜVENLİK KODU (CVV)</span>
                      
                      <div className="flex items-center space-x-2">
                        {/* Mock Signature lines */}
                        <div className="flex-grow h-7 bg-white/10 rounded border border-white/5 flex flex-col justify-around px-2 opacity-50">
                          <div className="w-full h-0.5 bg-gray-400"></div>
                          <div className="w-3/4 h-0.5 bg-gray-400"></div>
                        </div>
                        {/* CVV text box */}
                        <div className="w-12 h-7 bg-white text-black font-extrabold flex items-center justify-center rounded text-xs tracking-widest font-mono">
                          {cardCvv || '***'}
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-[7px] text-gray-500 mt-2 px-6 leading-none">
                      Bu kart Yemeksepeti güvenli ödeme simülasyonu için tasarlanmış bir mock karttır.
                    </div>
                  </div>

                </div>
              </div>

              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kart Detayları</h4>
              
              <FormInput
                label="Kart Üzerindeki İsim"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                required
              />

              <FormInput
                label="Kart Numarası"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
                  const matched = raw.match(/.{1,4}/g);
                  setCardNumber(matched ? matched.join(' ') : raw);
                }}
                placeholder="0000 0000 0000 0000"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Son Kullanma"
                  id="cardExpiry"
                  value={cardExpiry}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
                    if (raw.length >= 2) {
                      setCardExpiry(`${raw.substring(0, 2)}/${raw.substring(2)}`);
                    } else {
                      setCardExpiry(raw);
                    }
                  }}
                  placeholder="AA/YY"
                  required
                />
                
                {/* CVV Input with focus/blur handlers */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">CVV</label>
                  <input
                    id="cardCvv"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    placeholder="***"
                    className="w-full bg-[#17171C] border border-[#2e303a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7A1E2C] transition"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <div className="lg:col-span-1 self-start">
        <div className="bg-[#17171C] border border-[#2e303a] rounded-2xl p-6 shadow-lg space-y-6 text-left">
          <h3 className="text-xl font-bold text-white pb-3 border-b border-[#2e303a] tracking-tight">Sipariş Özeti</h3>
          
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Yemek / Menü Toplamı:</span>
              <span className="text-white font-bold">{totals.productTotal} TL</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>İçecek Toplamı:</span>
              <span className="text-white font-bold">{totals.drinkTotal} TL</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Sos Toplamı:</span>
              <span className="text-white font-bold">{totals.sauceTotal} TL</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Toplam Adet:</span>
              <span className="text-white font-bold">{totals.totalQty} Adet</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Ödeme Tipi:</span>
              <span className="text-white font-bold">{getPaymentLabel(paymentMethod)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Teslimat Ücreti:</span>
              <span className="text-emerald-500 font-bold">Ücretsiz</span>
            </div>
            
            <div className="pt-4 border-t border-[#2e303a]/50 flex justify-between items-center">
              <span className="text-base text-white font-bold uppercase tracking-wide">Genel Toplam:</span>
              <span className="text-[#B83246] text-2xl font-black">{totalPrice} TL</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-[#7A1E2C] hover:bg-[#B83246] text-white font-bold py-3.5 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-red-900/20 text-center uppercase tracking-wider text-xs cursor-pointer"
          >
            Siparişi Tamamla
          </button>

          <Link
            to="/customer"
            className="flex items-center justify-center space-x-1.5 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition"
          >
            <ArrowLeft size={13} />
            <span>Alışverişe Devam Et</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default Cart;
