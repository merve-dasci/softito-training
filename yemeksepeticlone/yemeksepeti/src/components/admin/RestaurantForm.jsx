import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import Button from '../common/Button';

const RestaurantForm = React.memo(({ onSubmit, categories = [] }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Burger');
  const [rating, setRating] = useState('4.5');
  const [deliveryTime, setDeliveryTime] = useState('20-30 dk');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('active');
  const [ownerId, setOwnerId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      category,
      rating: parseFloat(rating) || 4.5,
      deliveryTime,
      image,
      status,
      ownerId: ownerId ? String(ownerId) : null
    });
    // Reset local inputs
    setName('');
    setImage('');
    setOwnerId('');
    setStatus('active');
  };

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.name
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#17171C] border border-[#2e303a] p-6 rounded-xl space-y-4 shadow-md transition-all duration-300 animate-fadeIn"
    >
      <h4 className="text-base font-bold text-white text-left">Restoran Bilgileri</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Restoran Adı"
          id="resName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: Burger Kebap Evi"
          required
        />
        
        <FormSelect
          label="Kategori"
          id="resCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions.length > 0 ? categoryOptions : [{ label: 'Burger', value: 'Burger' }]}
          required
        />

        <FormInput
          label="Puan"
          id="resRating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        <FormInput
          label="Teslimat Süresi"
          id="resDeliveryTime"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          placeholder="Örn: 25-35 dk"
          required
        />

        <FormSelect
          label="Durum"
          id="resStatus"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { label: 'Aktif', value: 'active' },
            { label: 'Pasif', value: 'passive' }
          ]}
          required
        />

        <FormInput
          label="İşletme Sahibi Kullanıcı ID (Opsiyonel)"
          id="resOwnerId"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          placeholder="Örn: 3"
        />
      </div>

      <FormInput
        label="Görsel URL"
        id="resImage"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="https://images.unsplash.com/..."
      />

      <div className="flex justify-start pt-2">
        <Button type="submit" variant="primary">
          Restoranı Kaydet
        </Button>
      </div>
    </form>
  );
});

RestaurantForm.displayName = 'RestaurantForm';

export default RestaurantForm;
