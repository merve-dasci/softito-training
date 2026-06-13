const SayfaBasligi = () => {
    return (
        <header className="p-4 bg-gray-200">
            <h4 className="text-lg font-bold">Uygulama Üst Başlığı</h4>
        </header>
    )
}
const SayfaIcerigi = () => {
    return(
        <main className="p-4 border">
            <p>Burası sayfanın ana içerik alanıdır. Kompozisyon yapısı ile tasarlandı.</p>
        </main>
    )
};

const SayfaAlti = () => {
    return (
        <footer className="p-3 bg-gray-100">
            <p className="text-xs text-gray-500">Tüm hakları saklıdır. (C) 2026</p>
        </footer>
    )
};

const Demo10Composition = () => {
    return (
        <div className="p-4">
            <h3 className="text-xl font-bold">Demo 10: Bileşen Kompozisyonu</h3>
            <p className="mt-2 text-gray-600">Farklı küçük bileşenleri birleştirerek tam bir sayfa düzeni (layout) oluşturuyoruz.</p>

            <div className="mt-4 border">
                <SayfaBasligi/>
                <SayfaIcerigi />
                <SayfaAlti />
            </div>
        </div>
    )
};

export default Demo10Composition;