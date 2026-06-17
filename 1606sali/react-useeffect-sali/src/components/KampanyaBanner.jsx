// React kütüphanesinden useState ve useEffect hooklarını import ediyoruz.
// useState component içinde değişebilen veri tutmak için kullanılır.
// useEffect ise component çalıştığında timer gibi yan işlemleri başlatmak için kullanılır.
import { useState, useEffect } from "react";

// KampanyaBanner componentini dışarı aktarıyoruz.
// Bu component kampanya alanındaki geri sayımı yönetir.
export default function KampanyaBanner() {
  // secondsLeft adında bir state oluşturuyoruz.
  // Bu state kampanyanın bitmesine kalan süreyi saniye cinsinden tutar.
  // setSecondsLeft ise bu state'i güncellemek için kullanılır.
  const [secondsLeft, setSecondsLeft] = useState(3600 * 3 + 1200);

  // 3600 saniye = 1 saattir.
  // 3600 * 3 = 3 saat eder.
  // 1200 saniye = 20 dakika eder.
  // Yani başlangıçta sayaç 3 saat 20 dakika olarak başlatılır.

  // useEffect burada sayaç sistemini başlatmak için kullanılıyor.
  // Component ekrana geldikten sonra çalışır.
  useEffect(() => {
    // setInterval, belirli aralıklarla bir fonksiyonu tekrar tekrar çalıştırır.
    // Burada her 1000 milisaniyede, yani her 1 saniyede bir çalışır.
    const timer = setInterval(() => {
      // setSecondsLeft ile kalan süre state'ini güncelliyoruz.
      // Burada functional update yöntemi kullanıyoruz.
      // prev, secondsLeft state'inin bir önceki değeridir.
      // Sayaç gibi önceki değere bağlı güncellemelerde bu yöntem daha güvenlidir.
      setSecondsLeft((prev) => {
        // Eğer kalan süre 1 veya daha küçükse sayaç sıfırlanmak üzere demektir.
        // Bu durumda tekrar başlangıç süresine döndürüyoruz.
        if (prev <= 1) {
          return 3600 * 3 + 1200;
        }

        // Eğer sayaç bitmediyse önceki değerden 1 çıkarıyoruz.
        // Böylece her saniye sayaç 1 saniye azalır.
        return prev - 1;
      });

      // 1000 milisaniye 1 saniyeye eşittir.
    }, 1000);

    // useEffect içinde return edilen fonksiyon cleanup fonksiyonudur.
    // Component ekrandan kaldırılırsa interval temizlenir.
    // Bu yapılmazsa sayaç component silinse bile arka planda çalışmaya devam edebilir.
    return () => {
      // clearInterval, setInterval ile başlatılan tekrar eden işlemi durdurur.
      clearInterval(timer);
    };

    // Dependency array boş olduğu için bu effect sadece component ilk yüklendiğinde çalışır.
  }, []);

  // formatCountdown yardımcı bir fonksiyondur.
  // Görevi saniye cinsinden gelen süreyi 00:00:00 formatına çevirmektir.
  const formatCountdown = (totalSecs) => {
    // Math.floor ondalıklı sayının aşağı yuvarlanmış tam sayı halini verir.
    // totalSecs / 3600 ile toplam saniyenin kaç saate denk geldiğini buluyoruz.
    const hours = Math.floor(totalSecs / 3600);

    // totalSecs % 3600, saat hesaplandıktan sonra geriye kalan saniyeyi verir.
    // Bu kalan saniyeyi 60'a bölerek dakika değerini buluyoruz.
    const minutes = Math.floor((totalSecs % 3600) / 60);

    // totalSecs % 60, toplam saniyeden geriye kalan saniye kısmını verir.
    // Örneğin 125 saniye varsa 2 dakika 5 saniye olduğu için sonuç 5 olur.
    const seconds = totalSecs % 60;

    // Template literal kullanıyoruz.
    // Backtick içinde ${} ile JavaScript ifadelerini metne gömebiliriz.
    // toString sayıyı stringe çevirir.
    // padStart(2, "0") değer tek haneliyse başına 0 ekler.
    // Örneğin 5 değeri "05" olarak görünür.
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Componentin ekrana basacağı JSX burada başlar.
  return (
    <div className="slider-banner">
      <div className="slider-bilgi">
        {/* Kampanyanın üst etiket metnidir. */}
        <span className="slider-etiket">GÜNÜN FIRSATI</span>

        {/* Kampanya başlığıdır. */}
        <h2 className="slider-baslik">Büyük Yaz İndirimleri Başladı!</h2>

        {/* Kampanya açıklama metnidir. */}
        <p className="slider-detay">
          Tüm Elektronik, Giyim ve Kitaplarda sepette anında %40'a varan
          indirimleri kaçırmayın.
        </p>
      </div>

      <div className="slider-sayac">
        {/* Geri sayım alanının açıklama metni. */}
        <span>⏰ Kalan Süre:</span>

        {/* secondsLeft state'i her saniye değişir.
            State değiştiği için component yeniden render edilir.
            Her renderda formatCountdown tekrar çalışır ve yeni süre ekrana basılır. */}
        <span>{formatCountdown(secondsLeft)}</span>
      </div>
    </div>
  );
}
