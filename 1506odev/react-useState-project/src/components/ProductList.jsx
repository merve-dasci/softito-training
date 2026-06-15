import ProductCard from "./ProductCard";

const ProductList = ({urunler, urunSil}) => {
    return (
      <div className="bg-white border border-pink-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-pink-700">Ürün Listesi</h2>

          <span className="bg-pink-100 text-pink-700 text-sm font-semibold px-3 py-1 rounded-full">
            Toplam: {urunler.length}
          </span>
        </div>

        {urunler.length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz ürün bulunmuyor.</p>
        ) : (
          <div className="space-y-3">
            {urunler.map((urun) => (
              <ProductCard key={urun.id} urun={urun} urunSil={urunSil} />
            ))}
          </div>
        )}
      </div>
    );
}
export default ProductList;