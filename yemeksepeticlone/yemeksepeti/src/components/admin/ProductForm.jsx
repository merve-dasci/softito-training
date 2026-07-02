import React, { useState, useEffect } from 'react';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import Button from '../common/Button';

const ProductForm = React.memo(({ onSubmit, restaurants = [] }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [image, setImage] = useState('');

  // Set default restaurant select once loaded
  useEffect(() => {
    if (restaurants.length > 0 && !restaurantId) {
      setRestaurantId(restaurants[0].id);
    }
  }, [restaurants, restaurantId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !restaurantId) return;

    onSubmit({
      name,
      description,
      price: parseFloat(price) || 0,
      restaurantId: String(restaurantId),
      image
    });

    setName('');
    setDescription('');
    setPrice('');
    setImage('');
  };

  const restaurantOptions = restaurants.map((r) => ({
    label: r.name,
    value: r.id
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#17171C] border border-[#2e303a] p-6 rounded-xl space-y-4 shadow-md transition-all duration-300 animate-fadeIn"
    >
      <h4 className="text-base font-bold text-white text-left">Ürün Bilgileri</h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <FormInput
            label="Ürün Adı"
            id="prodName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Double Cheese Menu"
            required
          />
        </div>
        <FormInput
          label="Fiyat (TL)"
          id="prodPrice"
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Örn: 220"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect
          label="Restoran Seçimi"
          id="prodResSelect"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          options={restaurantOptions}
          required
        />

        <FormInput
          label="Açıklama"
          id="prodDesc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Örn: Patates ve içecek ile"
        />
      </div>

      <FormInput
        label="Ürün Görsel URL"
        id="prodImage"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="https://images.unsplash.com/..."
      />

      <div className="flex justify-start pt-2">
        <Button type="submit" variant="primary">
          Ürünü Menüye Ekle
        </Button>
      </div>
    </form>
  );
});

ProductForm.displayName = 'ProductForm';

export default ProductForm;
