import { useState } from 'react'


import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

function App() {
  const [urunler, setUrunler] = useState([
    {
      id: 1,
      urunAdi: "Maybelline Sky High Maskara",
      kategori: "Kozmetik",
      stoktaVar: true,
    },
    {
      id: 2,
      urunAdi: "Kablosuz Mouse",
      kategori: "Elektronik",
      stoktaVar: true,
    },
    {
      id: 3,
      urunAdi: "Loreal True Match Fondöten",
      kategori: "Kozmetik",
      stoktaVar: false,
    },
  ]);

const urunSil = (id) => {
  const onay = window.confirm("Bu ürünü silmek istediğinize emin misiniz?");

  if (!onay) return;

  const filtrelenmisUrunler = urunler.filter((urun) => urun.id !== id);

  setUrunler(filtrelenmisUrunler);
};

  const urunEkle = (yeniUrun) =>{
    setUrunler([...urunler, yeniUrun]);
  }

  return (
    <>
      <div className="min-h-screen bg-pink-50 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-pink-700">
            Mini Ürün Yönetim Paneli
          </h1>

          <p className="text-gray-600 mt-2">
            useState, Form Yönetimi ve filter ile silme işlemi
          </p>
          <div className="mt-6">
            <ProductForm  urunEkle={urunEkle}/>
          </div>
          <div className="mt-6">
            <ProductList urunler={urunler} urunSil={urunSil}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
