const ProductCard = ({urun, urunSil}) => {
    return (
      <div className="border border-pink-100 rounded-lg p-3">
        <h3 className="font-semibold text-gray-800">{urun.urunAdi}</h3>

        <p className="text-sm text-gray-600">Kategori: {urun.kategori}</p>

        <p className="text-sm">
          {urun.stoktaVar ? "✅ Stokta Var" : "❌ Stokta Yok"}
        </p>
        <button
          onClick={() => urunSil(urun.id)}
          className="mt-3 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition"
        >Sil</button>
      </div>
    );
}
export default ProductCard;