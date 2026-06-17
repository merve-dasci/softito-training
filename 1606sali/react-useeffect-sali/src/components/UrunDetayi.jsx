// React'ten useEffect hookunu import ediyoruz.
// useEffect component yüklendiğinde veya belirli değerler değiştiğinde
// yan işlemler (side effect) çalıştırmamızı sağlar.
import { useEffect } from "react";

// Ürün detay modal componenti.
// Kullanıcı ürün kartına tıklayınca açılan pencereyi temsil eder.
export default function UrunDetayi({
  // Modalı kapatmak için parent componentten gelen fonksiyon.
  onClose,

  // Detayı gösterilecek ürün nesnesi.
  product,

  // Ürünü sepete eklemek için gelen fonksiyon.
  onSepeteEkle,
}) {
  // İlk useEffect:
  // Escape tuşuna basılınca modalı kapatmak için kullanılıyor.
  useEffect(() => {
    // Tarayıcıdan gelen keyboard eventini yakalayacak fonksiyon.
    const handleKeyDown = (e) => {
      // e.key basılan tuşun adını verir.
      // Escape tuşuna basılmışsa modal kapatılır.
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Window seviyesinde keydown eventini dinlemeye başlıyoruz.
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup fonksiyonu.
    // Component ekrandan kaldırılırken çalışır.
    return () => {
      // Event listener kaldırılmazsa bellek sızıntısı oluşabilir.
      window.removeEventListener("keydown", handleKeyDown);
    };

    // onClose değişirse effect yeniden çalışsın.
  }, [onClose]);

  // İkinci useEffect:
  // Modal açıkken arka sayfanın scroll edilmesini engelliyor.
  useEffect(() => {
    // body overflow hidden yapılınca scroll kaybolur.
    document.body.style.overflow = "hidden";

    // Modal kapanırken eski haline dönüyoruz.
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Ürünün stok durumuna göre uyarı oluşturacak yardımcı fonksiyon.
  const getInventoryWarning = () => {
    // Eğer product yoksa null döndür.
    // Böylece hata alınmaz.
    if (!product) return null;

    // Stok tamamen bittiyse.
    if (product.stok === 0) {
      // Object dönüyoruz.
      // Sonra JSX içinde warning.text kullanacağız.
      return {
        level: "danger",
        text: "Tükendi:Bu ürün geçici olarak temin edilemiyor",
      };
    }

    // Stok 5'in altındaysa düşük stok uyarısı.
    if (product.stok < 5) {
      return {
        level: "warning",
        text: `Düşük Stok: Bu üründen son ${product.stok} adet kaldı!`,
      };
    }

    // Uyarı gerekmiyorsa null dön.
    return null;
  };

  // Fonksiyonu çalıştırıp sonucunu warning değişkenine atıyoruz.
  const warning = getInventoryWarning();

  // Eğer ürün yoksa hiçbir şey render etme.
  if (!product) return null;

  // JSX kısmı başlıyor.
  return (
    <>
      {/* Modalın arka plan maskesi */}

      {/* Kullanıcı maskeye tıklarsa modal kapanır */}
      <div onClick={onClose} className="modal-maske">
        {/* stopPropagation önemli bir event metodudur */}

        {/* Eğer bunu yazmazsak kullanıcı modal kutusuna tıklayınca
            click olayı parent'a da gider ve modal kapanır */}

        {/* Event bubbling'i engellemiş oluyoruz */}
        <div className="modal-kutu" onClick={(e) => e.stopPropagation()}>
          {/* Sol taraf görsel alanı */}
          <div className="modal-resim-bolumu">
            {/* Ürün kategorisini gösteriyoruz */}
            <span className="modal-kategori-badge">{product.kategori}</span>

            {/* Emoji görselini gösteriyoruz */}
            <span className="modal-resim-emoji">{product.gorsel}</span>
          </div>

          {/* Sağ içerik alanı */}
          <div className="modal-icerik-bolumu">
            <div className="modal-baslik-alani">
              <div>
                {/* Marka bilgisi */}
                <span className="marka-etiketi">{product.marka}</span>

                {/* Ürün adı */}
                <h2 className="app-card-title">{product.ad}</h2>
              </div>

              {/* Kapatma butonu */}
              <div onClick={onClose} className="modal-kapat-butonu">
                x
              </div>
            </div>

            <div className="modal-urun-bilgi">
              {/* warning null değilse uyarı göster */}

              {/* && operatörü React'te çok kullanılır */}

              {/* Sol taraf true ise sağ taraf render edilir */}
              {warning && (
                <div className="alert-banner">
                  {/* warning objectinden text alanını gösteriyoruz */}
                  <span className="modal-detay-deger">{warning.text}</span>
                </div>
              )}

              <div className="modal-detay-listesi">
                <div className="modal-detay-satiri">
                  <span className="modal-detay-etiket">Birim Fiyatı</span>

                  {/* toFixed sayıyı 2 ondalıklı gösterir */}
                  <span className="yeni-fiyat-etiketi">
                    {product.fiyat.toFixed(2)} TL
                  </span>
                </div>

                <div className="modal-detay-satiri">
                  <span className="modal-detay-etiket">Kalan Stok</span>

                  <span className="modal-detay-deger">{product.stok} Adet</span>
                </div>

                <div className="modal-detay-satiri">
                  <span className="modal-detay-etiket">Müşteri Beğenisi</span>

                  {/* toFixed(1) ile 4.356 → 4.4 olur */}
                  <span className="modal-detay-deger">
                    *{product.degerlendirme.toFixed(1)}({product.yorumAdedi}{" "}
                    Yorum)
                  </span>
                </div>

                <div className="modal-detay-satiri">
                  <span className="modal-detay-etiket">Açıklama</span>

                  <span className="modal-detay-deger">{product.tanim}</span>
                </div>
              </div>

              <span className="modal-yorumlar-baslik">
                Müşteri Değerlendirmeleri
              </span>

              <div className="modal-yorumlar-listesi">
                {/* Önce incelemeler var mı kontrol ediyoruz */}

                {product.incelemeler &&
                  // map ile yorumları dolaşıyoruz
                  product.incelemeler.map((review, index) => {
                    // Regex kullanıyoruz.

                    // Örneğin:
                    // [2 gün önce] Çok güzel ürün

                    // kısmındaki zamanı ayıklıyoruz.

                    const timeMatch = review.match(/^\[(.*?)\]/);

                    // Regex eşleştiyse ilk sonucu al.
                    const time = timeMatch ? timeMatch[0] : "";

                    // Eğer zaman bulunduysa
                    // yorumun geri kalan kısmını ayır.
                    const message = timeMatch
                      ? review.slice(time.length).trim()
                      : review;

                    return (
                      // map kullanırken key gerekir.
                      <div key={index} className="modal-yorum-kart">
                        <div className="modal-yorum-yazar-satir">
                          <span className="modal-yorum-yazar">
                            {/* Ternary kullanıyoruz */}

                            {time
                              ? "Kullanıcı Değerlendirmesi"
                              : "Anonim Müşteri"}
                          </span>

                          <span>{time}</span>
                        </div>

                        <p className="modal-yorum-metin">{message}</p>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="modal-aksiyon-alani">
              <button
                // Tıklanınca önce sepete ekle
                // sonra modalı kapat
                onClick={() => {
                  onSepeteEkle(product);
                  onClose();
                }}
                // Eğer stok bittiyse buton pasif olur.
                disabled={product.stok === 0}
                className="urun-sepet-ekle-butonu"
              >
                {/* Stok durumuna göre yazı değişiyor */}
                {product.stok === 0 ? "Tükendi" : "Sepete Ekle"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
