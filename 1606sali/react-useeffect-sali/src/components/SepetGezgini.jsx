// Hook: React componentleri içinde özel React özelliklerini kullanmamızı sağlayan fonksiyonlardır. 
// useMemo: Bir değeri hafızada tutar ve bağımlılıkları değişmedikçe tekrar hesaplamaz.
import { useMemo } from "react";

//bu component sepetin sağdan açılan panel görünümünü oluşturur.
// Burada propsları direkt parametre içinde destructuring yöntemiyle alıyoruz.
export default function SepetGezgini({
  //Sepetteki ürünlerin tutulduğu diziyi burda sepet olarak belirttik
  // sepet prop'u, App.jsx içindeki sepet state'inden gelir. İçinde sepete eklenen ürünlerin bulunduğu bir array vardır.
  sepet,
  //Sepet panelinin açık mı kapalı mı olduğunu belirtmek için boolean olan bir değer verdik.
  isOpen,
  //Sepet panelini kapatmak için bir fonksiyon belirttik. Parent componentten gelir
  onClose,
  //Sepetteki ürün adetini arttırmak ya da azaltmak için bir fonksiyon belirledik.
  onAdetGuncelle,
  //Sepetten ürünü tamamen çıkarmak için belirlediğimiz fonksiyon
  onUrunCikar,
}) {
  //Sepetteki ürünlerin toplam fiyatını burada hesapladık.
  //useMemo sayesinde bu hesaplama sadece sepet değiştiğinde yeniden yepılır.
  // Burada normal değişken yerine useMemo kullanıyoruz. Çünkü toplam fiyat sepet değişmedikçe tekrar tekrar hesaplanmak zorunda değildir.
  const toplamFiyat = useMemo(() => {
    // reduce metodu, array içindeki elemanları tek bir sonuca indirger. // Burada sepet dizisini tek bir sayı değerine, yani toplam fiyata dönüştürüyoruz. // toplam parametresi birikimli toplamı tutar. // item parametresi sepet içindeki o anki ürünü temsil eder. // 0 ise toplam değişkeninin başlangıç değeridir.
    return sepet.reduce((toplam, item) => toplam + item.fiyat * item.adet, 0);
    // [sepet] dependency array'dir. Yani bu hesaplama sadece sepet değiştiğinde yeniden çalışır.
  }, [sepet]);

  //Kargonun ücretsiz olması için sepetin olması gereken minimum tutarını belirledik.
  const kargoLimit = 1500;

  // Ternary operator kullanıyoruz.Yapısı: şart ? doğruysa_bu : yanlışsa_bu // Eğer toplam fiyat 1500 TL veya üzerindeyse kargo ücretsizdir.Eğer toplam fiyat 0 ise yani sepet boşsa da kargo 0 gösterilir. Diğer tüm durumlarda kargo ücreti 50 TL olur.
  const kargoUcreti = toplamFiyat >= kargoLimit || toplamFiyat === 0 ? 0 : 50;

  // Ücretsiz kargoya ulaşmak için kalan tutarı hesaplıyoruz. // Math.max(0, değer) kullanmamızın sebebi negatif sonuç çıkmasını engellemektir. // Örneğin toplamFiyat 2000 olursa 1500 - 2000 = -500 olurdu. // Ama kalan tutarın negatif görünmesi mantıksız olduğu için en düşük 0 olsun diyoruz.
  const kalanTutar = Math.max(0, kargoLimit - toplamFiyat);

  // İlerleme barının yüzde kaç dolacağını hesaplıyoruz. // toplamFiyat / kargoLimit oran verir. // * 100 yaparak bunu yüzdeye çeviriyoruz. // Math.min(..., 100) ile yüzde değerinin 100'ü geçmesini engelliyoruz.
  const ilerlemeYuzdesi = Math.min((toplamFiyat / kargoLimit) * 100, 100);

  // Sepet drawer'ının açık veya kapalı olmasına göre className oluşturuyoruz.
  // Burada template literal kullanıyoruz. // Template literal backtick işaretiyle yazılır. // İçinde ${} ile JavaScript ifadesi çalıştırabiliriz. // isOpen true ise visible class'ı, false ise hidden class'ı eklenir.
  const drawerClass = `sepet-drawer ${isOpen ? "sepet-drawer-visible" : "sepet-drawer-hidden"}`;
  // Eğer sepet paneli açık değilse ekranda hiçbir şey göstermiyoruz.
  // Conditional rendering yapıyoruz. // Eğer isOpen false ise component hiçbir JSX döndürmez. // return null, React'te ekrana hiçbir şey basma anlamına gelir.
  if (!isOpen) return null;

  return (
    <>
      {/* Bu div arka plan karartma alanıdır. onClick event'i ile kullanıcı arka plana tıklayınca onClose fonksiyonu çalışır. onClose parenttan geldiği için sepetAcik state'ini false yapar. */}
      <div onClick={onClose} className="drawer-arka-plan"></div>
      {/* className'e yukarıda hazırladığımız drawerClass değişkenini veriyoruz. Böylece sepetin açık/kapalı görünümü isOpen durumuna göre değişir. */}
      <div className={drawerClass}>
        <div>
          <div className="drawer-ust">
            <h3 className="app-card-title">
              {/* Burada tekrar reduce kullanıyoruz. Ama bu kez toplam fiyat değil, toplam ürün adedi hesaplıyoruz. sum başlangıçta 0'dır. Her item için item.adet değeri sum üzerine eklenir. */}
              Sepetim ({sepet.reduce((sum, item) => sum + item.adet, 0)} Ürün)
            </h3>
            <button onClick={onClose} className="drawer-kapat-btn">
              ✕
            </button>
          </div>
          {/* && operatörü ile conditional rendering yapıyoruz. sepet.length > 0 true ise sağdaki JSX çalışır. Sepet boşsa bu alan hiç render edilmez. */}
          {sepet.length > 0 && (
            <div className="sepet-kargo-ilerleme-kutusu">
              {/* Toplam fiyat kargo limitini geçtiyse bedava kargo mesajı gösterilir. */}
              {toplamFiyat >= kargoLimit ? (
                <span className="sepet-kargo-ilerleme-metni">
                  🎉 Kargonuz Bedava!
                </span>
              ) : (
                // Limit geçilmediyse kaç TL kaldığını gösteriyoruz.
                <span className="sepet-kargo-ilerleme-metni">
                  {/* strong etiketi metni kalın göstermek için kullanılır. kalanTutar.toFixed(2), sayıyı virgülden sonra 2 basamaklı gösterir. Örneğin 450 yerine 450.00 yazdırır. */}
                  🚚 Kargo bedava için{" "}
                  <strong>{kalanTutar.toFixed(2)} TL</strong> daha ekleyin!
                </span>
              )}
              <div className="ilerleme-bar-yolu">
                <div
                  className="ilerleme-bar-doluluk"
                  style={{ width: `${ilerlemeYuzdesi}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="sepet-liste-alani">
            {/* Burada ternary operator ile sepet boş mu dolu mu kontrol ediyoruz. sepet.length === 0 true ise boş sepet mesajı gösterilir. false ise map ile ürünler listelenir. */}
            {sepet.length === 0 ? (
              <div className="sepet-bos-etiket">
                <span>Sepetiniz şu anda boş.</span>
              </div>
            ) : (
              // map metodu array içindeki her eleman için JSX üretir. // React'te listeleme yaparken en sık kullanılan yöntemdir. sepet.map((item) => ( // key prop'u React için zorunluya yakın önemli bir yapıdır. // React hangi elemanın değiştiğini, silindiğini veya eklendiğini key sayesinde takip eder. // key olarak benzersiz id kullanmak doğru bir tercihtir.
              sepet.map((item) => (
                <div key={item.id} className="sepet-urun-satir">
                  <div className="sepet-eleman-bilgi">
                    <span className="sepet-urun-ad">{item.ad}</span>
                    {/* item.fiyat number tipindedir. toFixed(2), fiyatı para formatına daha yakın göstermek için kullanılır. */}
                    <span className="sepet-urun-fiyat">
                      {item.fiyat.toFixed(2)} TL
                    </span>

                    <div className="sepet-adet-kontrolleri">
                      {/* onClick içine direkt fonksiyon çağırmıyoruz. Yani onClick={onAdetGuncelle(...)} yazmıyoruz. Çünkü öyle yazarsak render sırasında hemen çalışır. Bunun yerine arrow function kullanıyoruz. Böylece butona tıklanınca çalışır. */}
                      <button
                        onClick={() => onAdetGuncelle(item.id, item.adet - 1)}
                        className="sepet-adet-btn"
                      >
                        -
                      </button>
                      <span className="sepet-adet-yazi">{item.adet}</span>
                      {/* Artırma işleminde mevcut adedin 1 fazlasını gönderiyoruz. Gerçek state güncellemesi bu componentte değil, App.jsx içindeki handleAdetGuncelle fonksiyonunda yapılır. */}
                      <button
                        onClick={() => onAdetGuncelle(item.id, item.adet + 1)}
                        className="sepet-adet-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="sepet-satir-sag">
                    {/* Bir ürünün satır toplamını hesaplıyoruz. Ürün fiyatı ile ürün adedini çarpıyoruz. Sonucu toFixed(2) ile iki ondalık basamaklı gösteriyoruz. */}
                    <span className="sepet-satir-toplam-fiyat">
                      {(item.fiyat * item.adet).toFixed(2)} TL
                    </span>
                    {/* Sil butonuna tıklanınca ürün id'sini onUrunCikar fonksiyonuna gönderiyoruz. Bu component sadece olayı bildirir. Sepetten silme işlemini App.jsx yapar. */}
                    <button
                      onClick={() => onUrunCikar(item.id)}
                      className="sepet-satir-sil-btn"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Sepette ürün varsa ödeme panelini gösteriyoruz. && kullanımında sol taraf true ise sağ taraf render edilir. */}
        {sepet.length > 0 && (
          <div className="sepet-alt-odeme-paneli">
            <div className="odeme-detay-satiri">
              <span className="detail-meta-label">Ara Toplam</span>
              {/* Ternary operator ile kargo ücretsizse "Bedava", ücretliyse fiyatı yazdırıyoruz. */}
              <span className="detail-meta-val font-mono">
                {toplamFiyat.toFixed(2)} TL
              </span>
            </div>
            <div className="odeme-detay-satiri">
              <span className="detail-meta-label">Kargo Ücreti</span>
              <span className="detail-meta-val font-mono">
                {kargoUcreti === 0 ? "Bedava" : `${kargoUcreti.toFixed(2)} TL`}
              </span>
            </div>
            <div className="odeme-detay-satiri border-t border-slate-100 pt-3">
              <span className="app-card-title">Genel Toplam</span>
              {/* Genel toplam, ürünlerin toplam fiyatı ile kargo ücretinin toplamıdır. Parantez içinde işlem yaparak önce toplama işlemini garanti ediyoruz. */}
              <span className="odeme-genel-toplam">
                {(toplamFiyat + kargoUcreti).toFixed(2)} TL
              </span>
            </div>
            <div className="terminal-header">
              {/* Butona basınca örnek bir sipariş alındı mesajı gösteriyoruz. */}
              <button
                onClick={() =>
                  alert("Siparişiniz başarıyla alındı! (Simülasyon)")
                }
                className="btn btn-primary w-full"
              >
                Alışverişi Tamamla
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
