// React içinden useState import edilmiş.
// Ama bu dosyada useState kullanılmıyor.
// Kullanılmayan import olduğu için istenirse silinebilir.
// Kod çalışmasını bozmaz ama temiz kod açısından gereksizdir.
import { useState } from "react";

// UrunListesi componentini dışarı aktarıyoruz.
// Bu component ürünlerin listelendiği katalog alanını yönetir.
export default function UrunListesi({
  // products prop'u App.jsx tarafından gönderilen ürün listesidir.
  // Bu liste kategoriye ve sepetteki stok durumuna göre hazırlanmış gelir.
  products,

  // loading true ise ürünler henüz yükleniyor demektir.
  loading,

  // error varsa ürünler yüklenirken hata oluşmuş demektir.
  error,

  // activeCategory şu an seçili kategoriyi tutar.
  // Örnek: "all", "Elektronik", "Giyim", "Kitap"
  activeCategory,

  // onCategoryChange kategori değişince çalışacak fonksiyondur.
  // Asıl state güncellemesi App.jsx içinde yapılır.
  onCategoryChange,

  // onSelectProduct ürün kartına tıklanınca çalışır.
  // Seçilen ürünü detay modalında göstermek için kullanılır.
  onSelectProduct,

  // onSepeteEkle ürünü sepete eklemek için parenttan gelen fonksiyondur.
  onSepeteEkle,

  // searchTerm arama inputuna yazılan metindir.
  // Bu değer Baslik.jsx içindeki inputtan gelir ama App.jsx state'inde tutulur.
  searchTerm,
}) {
  // filteredProducts değişkeni, products listesinin arama metnine göre filtrelenmiş halidir.
  // filter metodu array içinden şartı sağlayan elemanları yeni bir array olarak döndürür.
  const filteredProducts = products.filter(
    (item) =>
      // item.ad ürün adıdır.
      // toLowerCase kullanmamızın sebebi büyük/küçük harf duyarlılığını kaldırmaktır.
      // Örneğin kullanıcı "telefon" yazınca "Telefon" da bulunsun isteriz.
      item.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // || operatörü "veya" anlamına gelir.
      // Yani ürün adı eşleşirse de marka eşleşirse de ürün listede kalır.
      // includes metodu bir string içinde başka bir string var mı diye kontrol eder.
      item.marka.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Componentin ekrana basacağı JSX burada başlar.
  return (
    <div className="app-card">
      <div className="app-card-header">
        {/* Katalog alanının başlığıdır. */}
        <h2 className="app-card-title">Mağaza Kataloğu</h2>
      </div>

      <div className="app-card-body">
        <div className="etiket-izgara">
          <div className="filtre-paneli">
            {/* Kategori butonlarının başlığıdır. */}
            <span className="filtre-baslik">Kategoriler</span>

            <div className="kategori-secenekleri">
              {/* Tümü butonu.
                  Tıklanınca onCategoryChange fonksiyonuna "all" değeri gönderilir.
                  Bu fonksiyon App.jsx içinde currentCategory state'ini günceller. */}
              <button
                onClick={() => onCategoryChange("all")}
                // className dinamik olarak belirleniyor.
                // Template literal kullanıyoruz.
                // Eğer aktif kategori "all" ise aktif class eklenir.
                // Değilse pasif class eklenir.
                className={`kategori-secenek-btn ${activeCategory === "all" ? "kategori-secenek-btn-aktif" : "kategori-secenek-btn-pasif"}`}
              >
                Tümü
              </button>

              {/* Elektronik kategorisi butonu. */}
              <button
                onClick={() => onCategoryChange("Elektronik")}
                // Ternary operator kullanımı:
                // şart ? doğruysa : yanlışsa
                // activeCategory Elektronik ise aktif görünüm class'ı verilir.
                className={`kategori-secenek-btn ${activeCategory === "Elektronik" ? "kategori-secenek-btn-aktif" : "kategori-secenek-btn-pasif"}`}
              >
                Elektronik
              </button>

              {/* Giyim kategorisi butonu. */}
              <button
                onClick={() => onCategoryChange("Giyim")}
                // Seçili kategori Giyim ise aktif class,
                // değilse pasif class uygulanır.
                className={`kategori-secenek-btn ${activeCategory === "Giyim" ? "kategori-secenek-btn-aktif" : "kategori-secenek-btn-pasif"}`}
              >
                Giyim
              </button>

              {/* Kitap kategorisi butonu. */}
              <button
                onClick={() => onCategoryChange("Kitap")}
                // activeCategory Kitap ise buton aktif görünür.
                className={`kategori-secenek-btn ${activeCategory === "Kitap" ? "kategori-secenek-btn-aktif" : "kategori-secenek-btn-pasif"}`}
              >
                Kitaplar
              </button>
            </div>
          </div>

          <div className="urun-vitrini-alan">
            <div className="filter-bar">
              {/* Boş div muhtemelen tasarımda sağ-sol hizalamayı korumak için bırakılmış. */}
              <div></div>

              {/* filteredProducts.length filtreleme sonrası kaç ürün kaldığını verir. */}
              <div className="detail-meta-val">
                Bulunan: {filteredProducts.length} adet envanter
              </div>
            </div>

            {/* Burada üçlü conditional rendering mantığı var.
                Önce loading kontrol ediliyor.
                Eğer loading true ve error yoksa skeleton gösteriliyor.
                Eğer loading değil ama error varsa hata mesajı gösteriliyor.
                İkisi de yoksa gerçek ürün listesi gösteriliyor. */}
            {loading && !error ? (
              // Yüklenme sırasında skeleton kartları gösteriliyor.
              // Skeleton, veri gelene kadar kullanıcıya boş bir yükleniyor tasarımı gösterir.
              <div className="vitrin-grid">
                <div className="skeleton-container">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-bar-long"></div>
                  <div className="skeleton-bar-short"></div>
                </div>
                <div className="skeleton-container">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-bar-long"></div>
                  <div className="skeleton-bar-short"></div>
                </div>
                <div className="skeleton-container">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-bar-long"></div>
                  <div className="skeleton-bar-short"></div>
                </div>
              </div>
            ) : error ? (
              // Eğer error doluysa, yani hata mesajı varsa bu alan çalışır.
              <div className="skeleton-container">
                <span className="detail-meta-label">
                  {/* error değişkeni App.jsx içinde catch bloğunda setError ile dolduruluyor. */}
                  Katalog yüklenirken bir hata oluştu: {error}
                </span>
              </div>
            ) : (
              // Loading yoksa ve error yoksa ürünler listelenir.
              <div className="vitrin-grid">
                {/* filteredProducts dizisini map ile dönüyoruz.
                    map her ürün için bir ürün kartı JSX'i üretir. */}
                {filteredProducts.map((item) => (
                  // key React'in liste elemanlarını takip edebilmesi için gerekir.
                  // item.id benzersiz olduğu için doğru bir key seçimidir.
                  // Kartın tamamına tıklanınca ürün detay modalı açılır.
                  <div
                    key={item.id}
                    onClick={() => onSelectProduct(item)}
                    className="urun-kart"
                  >
                    <div className="urun-kart-ust">
                      {/* Ürüne ait emoji/görsel ekrana basılır. */}
                      <span className="resim-ikoni">{item.gorsel}</span>

                      <div className="urun-kart-content">
                        <div className="urun-kart-etiket-grubu">
                          {/* item.kargoBedava true ise kargo bedava rozeti gösterilir.
                              && operatörü React'te koşullu gösterim için kullanılır. */}
                          {item.kargoBedava && (
                            <span className="urun-kargo-bedava-badge">
                              Kargo Bedava
                            </span>
                          )}

                          {/* Eğer eski fiyat ile yeni fiyat arasındaki fark 300'den büyükse
                              ürün "Süper Fiyat" olarak işaretlenir.
                              Burada matematiksel çıkarma işlemi yapılıyor. */}
                          {item.eskiFiyat - item.fiyat > 300 && (
                            <span className="urun-super-fiyat-badge">
                              Süper Fiyat
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="urun-kart-detay">
                      <div>
                        {/* Ürünün marka bilgisi gösterilir. */}
                        <span className="marka-etiketi">{item.marka}</span>

                        {/* Ürünün adı gösterilir. */}
                        <h3 className="urun-baslik-etiketi">{item.ad}</h3>

                        <div className="puan-satiri">
                          {/* item.degerlendirme sayısal bir değerdir.
                              toFixed(1) ile virgülden sonra 1 basamak gösteriyoruz.
                              Örneğin 4.666 değeri 4.7 olarak görünür. */}
                          <span>★ {item.degerlendirme.toFixed(1)}</span>

                          {/* Ürüne ait yorum adedi gösterilir. */}
                          <span className="yorum-adedi-etiket">
                            ({item.yorumAdedi} yorum)
                          </span>
                        </div>

                        {/* Stok 0'dan büyük ve 5'ten küçükse düşük stok uyarısı gösterilir.
                            Burada iki şart && ile birlikte kullanılmıştır.
                            item.stok > 0 true olmalı ve item.stok < 5 true olmalı. */}
                        {item.stok > 0 && item.stok < 5 && (
                          <div className="stok-uyari-seridi">
                            <span>Son {item.stok} ürün!</span>
                          </div>
                        )}

                        {/* Stok tam olarak 0 ise tükendi uyarısı gösterilir. */}
                        {item.stok === 0 && (
                          <div className="stok-uyari-seridi bg-rose-50 border-rose-100 text-rose-600">
                            <span>Tükendi</span>
                          </div>
                        )}
                      </div>

                      <div className="urun-fiyat-grubu">
                        <div>
                          {/* item.eskiFiyat varsa eski fiyat alanı gösterilir.
                              Eğer eskiFiyat undefined, null veya 0 ise bu alan render edilmeyebilir. */}
                          {item.eskiFiyat && (
                            <span className="eski-fiyat-etiketi">
                              {item.eskiFiyat.toFixed(2)} TL
                            </span>
                          )}

                          {/* Yeni/current fiyat gösterilir.
                              toFixed(2) fiyatı 2 ondalık basamakla gösterir. */}
                          <span className="yeni-fiyat-etiketi">
                            {item.fiyat.toFixed(2)} TL
                          </span>
                        </div>

                        <button
                          // Sepete ekle butonuna tıklandığında çalışır.
                          onClick={(e) => {
                            // e.stopPropagation() burada çok önemlidir.
                            // Çünkü ürün kartının tamamında onClick var.
                            // Butona tıklanınca normalde kartın onClick'i de tetiklenirdi.
                            // Bu durumda hem sepete ekler hem de detay modalı açılırdı.
                            // stopPropagation bunu engeller.
                            e.stopPropagation();

                            // Ürünü sepete eklemek için parenttan gelen fonksiyonu çağırıyoruz.
                            onSepeteEkle(item);
                          }}
                          // Eğer stok 0 ise buton disabled olur.
                          // Disabled butona tıklanamaz.
                          disabled={item.stok === 0}
                          className="urun-sepet-ekle-butonu"
                        >
                          {/* Buton yazısı stok durumuna göre değişir.
                              Stok 0 ise "Tükendi",
                              stok varsa "Sepete Ekle" yazar. */}
                          {item.stok === 0 ? "Tükendi" : "Sepete Ekle"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
