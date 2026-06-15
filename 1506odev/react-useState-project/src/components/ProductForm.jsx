import { useState } from "react";

const ProductForm = ({urunEkle}) => {
    const [urun, setUrun] = useState({
        urunAdi: "", 
        kategori: "Elektronik",
        stoktaVar: false
    })

    const handleSubmit = (e) => {
      e.preventDefault();

      if (urun.urunAdi.trim() === "") {
        alert("Ürün adı boş olamaz.");
        return;
      }

      const yeniUrun = {
        id: Date.now(),
        urunAdi: urun.urunAdi,
        kategori: urun.kategori,
        stoktaVar: urun.stoktaVar,
      };

      urunEkle(yeniUrun);

      setUrun({
        urunAdi: "",
        kategori: "Elektronik",
        stoktaVar: false,
      });
    };

    
    return (
      <div className="bg-white border border-pink-200 rounded-2xl shadow-sm p-5">
        <h2 className="text-xl font-bold text-pink-700 mb-4">Yeni Ürün Ekle</h2>
        <form  onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Adı
            </label>
            <input
              type="text"
              value={urun.urunAdi}
              onChange={(e) =>
                setUrun({
                  ...urun,
                  urunAdi: e.target.value,
                })
              }
              placeholder="Örn: Kablosuz Mouse"
              className="w-full border border-pink-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={urun.kategori}
              onChange={(e) =>
                setUrun({
                  ...urun,
                  kategori: e.target.value,
                })
              }
              className="w-full border border-pink-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option>Elektronik</option>
              <option>Kozmetik</option>
              <option>Giyim</option>
              <option>Yemek</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={urun.stoktaVar}
              onChange={(e) =>
                setUrun({
                  ...urun,
                  stoktaVar: e.target.checked,
                })
              }
            />{" "}
            Stokta Var
          </label>
          <button
            className="w-full bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition"
            type="submit"
          >
            Ürün Ekle
          </button>
        </form>

        <div className="mt-4 bg-pink-50 p-3 rounded-lg">
          <pre>{JSON.stringify(urun, null, 2)}</pre>
        </div>
      </div>
    );
}
export default ProductForm;