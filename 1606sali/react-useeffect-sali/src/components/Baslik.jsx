// React kütüphanesinden useState ve useEffect hooklarını import ediyoruz.
// useState: Component içinde değişebilen veri tutmamızı sağlar.
// useEffect: Component yüklendiğinde, güncellendiğinde veya silindiğinde yan işlemler yapmamızı sağlar.
import { useState, useEffect } from "react";

// Baslik componentini dışarı aktarıyoruz.
// Bu component sayfanın üst header alanını oluşturur.
// Parametre kısmında propsları destructuring ile direkt alıyoruz.
export default function Baslik({
  env,
  sepetAdedi,
  onSepetAc,
  searchVal,
  onSearchChange,
}) {
  // windowSize adında bir state tanımlıyoruz.
  // State, component içinde değiştiğinde componentin yeniden render edilmesini sağlar.
  // Burada ekranın genişlik ve yükseklik bilgisini tutuyoruz.
  const [windowSize, setWindowSize] = useState({
    // window.innerWidth tarayıcı penceresinin anlık genişliğini verir.
    // İlk render anında başlangıç width değerini buradan alıyoruz.
    width: window.innerWidth,

    // window.innerHeight tarayıcı penceresinin anlık yüksekliğini verir.
    // İlk render anında başlangıç height değerini buradan alıyoruz.
    height: window.innerHeight,
  });

  // useEffect burada tarayıcı resize eventini dinlemek için kullanılıyor.
  // Component ekrana ilk geldiğinde çalışır.
  // Dependency array boş olduğu için sadece component mount olduğunda çalışır.
  useEffect(() => {
    // handleResize adında bir fonksiyon tanımlıyoruz.
    // Bu fonksiyon pencere boyutu değiştiğinde çalışacak.
    const handleResize = () => {
      // setWindowSize ile windowSize state'ini güncelliyoruz.
      // State güncellendiği için component yeniden render edilir.
      setWindowSize({
        // Yeni genişlik değerini tekrar window.innerWidth üzerinden alıyoruz.
        width: window.innerWidth,

        // Yeni yükseklik değerini tekrar window.innerHeight üzerinden alıyoruz.
        height: window.innerHeight,
      });
    };

    // window.addEventListener ile tarayıcıya bir event listener ekliyoruz.
    // "resize" eventi, tarayıcı penceresi büyütülüp küçültüldüğünde tetiklenir.
    // Resize olunca yukarıdaki handleResize fonksiyonu çalışır.
    window.addEventListener("resize", handleResize);

    // useEffect içinde return edilen fonksiyon cleanup fonksiyonudur.
    // Component ekrandan kaldırıldığında veya effect tekrar çalışmadan önce çalışır.
    // Burada event listener'ı temizliyoruz.
    return () => {
      // removeEventListener kullanmazsak component silinse bile event dinleyici bellekte kalabilir.
      // Bu da memory leak denen gereksiz bellek kullanımına yol açabilir.
      window.removeEventListener("resize", handleResize);
    };

    // Boş dependency array, bu effect'in sadece ilk renderdan sonra bir kere çalışmasını sağlar.
  }, []);

  // getEnvName yardımcı bir fonksiyondur.
  // cat parametresi aktif kategori bilgisini temsil eder.
  const getEnvName = (cat) => {
    // Eğer kategori "all" ise kullanıcıya daha anlamlı görünmesi için "TÜM KATEGORİLER" döndürüyoruz.
    if (cat === "all") return "TÜM KATEGORİLER";

    // Eğer kategori all değilse, kategori adını büyük harfe çevirerek döndürüyoruz.
    // toUpperCase string metodudur ve metindeki harfleri büyütür.
    return cat.toUpperCase();
  };

  // Componentin ekrana basacağı JSX burada başlar.
  return (
    <header className="eticaret-header">
      <div className="header-ust-alan">
        <div className="logo-alani">
          {/* Burası sitenin logo yazısıdır.
              className React'te HTML'deki class yerine kullanılır. */}
          <div className="site-logo-link">HEPSİAL</div>

          {/* Logo yanında küçük STORE rozeti gösteriliyor. */}
          <span className="site-logo-badge">STORE</span>
        </div>

        <div className="arama-alani">
          {/* input kontrollü input olarak kullanılıyor.
              Kontrollü input demek, inputun değerinin React state tarafından yönetilmesi demektir.
              value={searchVal} olduğu için inputun içindeki değer searchVal propundan gelir. */}
          <input
            type="text"
            placeholder="Ürün, kategori veya marka ara..."
            value={searchVal}
            // onChange input her değiştiğinde çalışır.
            // e burada event objesidir.
            // e.target, eventin gerçekleştiği input elemanını temsil eder.
            // e.target.value ise inputun o anki yazı değeridir.
            // Bu değer onSearchChange fonksiyonuna gönderilir.
            // onSearchChange aslında App.jsx içindeki setSearchTerm fonksiyonudur.
            onChange={(e) => onSearchChange(e.target.value)}
            className="arama-input"
          />

          {/* Bu buton görsel olarak arama butonudur.
              Şu an onClick verilmediği için arama işlemini buton değil,
              input değiştikçe çalışan searchTerm state'i yapıyor. */}
          <button className="arama-butonu">Ara</button>
        </div>

        <div className="kullanici-kontrolleri">
          {/* Bu alanlar şimdilik statik menü linki gibi duruyor.
              Herhangi bir onClick veya yönlendirme işlemi yok. */}
          <div className="menu-linki">Giriş Yap</div>
          <div className="menu-linki">Siparişlerim</div>

          {/* Sepet butonuna tıklanınca onSepetAc fonksiyonu çalışır.
              onSepetAc parent componentten gelir.
              App.jsx içinde setSepetAcik(true) çalıştırır.
              Böylece sepet drawer'ı açılır. */}
          <button onClick={onSepetAc} className="sepet-tetikleyici">
            <span>🛒 Sepetim</span>

            {/* Conditional rendering kullanıyoruz.
                Eğer sepetAdedi 0'dan büyükse sepet rozetini gösteriyoruz.
                Eğer 0 ise bu span hiç render edilmez. */}
            {sepetAdedi > 0 && (
              // sepetAdedi, sepetteki toplam ürün sayısını gösterir.
              // Bu değer App.jsx içinde reduce ile hesaplanıp prop olarak gönderiliyor.
              <span className="sepet-sayac-rozet">{sepetAdedi}</span>
            )}
          </button>
        </div>
      </div>

      <div className="kategori-seridi">
        {/* getEnvName fonksiyonunu JSX içinde çağırıyoruz.
            env propunu parametre olarak veriyoruz.
            Fonksiyon bize ekranda gösterilecek kategori adını döndürüyor. */}
        <span className="badge badge-gray">{getEnvName(env)}</span>

        {/* windowSize state'inden width değerini okuyup ekranda gösteriyoruz.
            windowSize.width değiştiğinde state güncellendiği için burası da otomatik güncellenir. */}
        <span className="detail-meta-label">
          | Çözünürlük: {windowSize.width}px
        </span>
      </div>
    </header>
  );
}
