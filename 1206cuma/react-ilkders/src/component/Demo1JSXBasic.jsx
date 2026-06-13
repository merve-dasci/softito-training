const Demo1JSXBasic = () => {
    const dersAdi = "React ve JSX Temelleri";
    const ogrenciSayisi = 24;
    const aktifMi = true;
    const dersYili = 2026;

    return (
      <div className="p-4">
        <h3 className="text-xl font-bold">Demo 1: Temel JSX Kullanımı</h3>
        <p className="mt-2 text-gray-600">
          Bu bölümde değişkenleri ve Javascript ifadelerini JSX içinde nasıl
          göstereceğimizi öğreniyoruz.
        </p>
        <div className="mt-4">
          <p className="border-b">
            <strong>Ders Adi:</strong>{dersAdi}
          </p>
          <p className="border-b">
            <strong>Öğrenci Sayısı:</strong>{ogrenciSayisi}
          </p>
          <p className="border-b"><strong>Ders Yılı:</strong>{dersYili}</p>
          <p className="border-b"><strong>Matematiksel İşlem (2 +2):</strong>{2 + 2}</p>
          <p className="border-b"><strong>Metin Dönüştürme:</strong>{dersAdi.toUpperCase()}</p>
          <p className="border-b"><strong>Ders Durumu:</strong>{aktifMi ? "Aktif" : "Pasif"}</p>
        </div>
      </div>
    );
};
export default Demo1JSXBasic;

