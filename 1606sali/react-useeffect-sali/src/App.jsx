// React içinden gerekli hookları import ediyoruz.
// useState: component içinde değişen veri tutmamızı sağlar.
// useMemo: pahalı veya tekrar eden hesaplamaları, bağımlılık değişmedikçe yeniden yapmamak için kullanılır.
// useEffect: component yüklendiğinde veri çekme gibi yan işlemleri yapmak için kullanılır.
// useCallback: fonksiyonları hafızada tutup gereksiz yeniden oluşmalarını azaltmak için kullanılır.
import { useState, useMemo, useEffect, useCallback } from "react";
import Baslik from "./components/Baslik";
import KampanyaBanner from "./components/KampanyaBanner";
import UrunListesi from "./components/UrunListesi";
import UrunDetayi from "./components/UrunDetayi";
import SepetGezgini from "./components/SepetGezgini";


// Uygulamanın merkezi state yönetimi burada yapılır.
export default function App() {
  // products state'i tüm ürün listesini tutar.
  // Başlangıçta boş array veriyoruz çünkü ürünler sonradan fetch ile gelecek.
  const [products, setProducts] = useState([]);

  // sepet state'i sepete eklenen ürünleri tutar.
  // Her ürün içinde id, ad, fiyat ve adet bilgisi bulunur.
  const [sepet, setSepet] = useState([]);

  // sepetAcik state'i sepet panelinin açık mı kapalı mı olduğunu tutar.
  // false başlangıçta kapalı demektir.
  const [sepetAcik, setSepetAcik] = useState(false);

  // loading state'i ürünler yükleniyor mu bilgisini tutar.
  // Başlangıçta true çünkü ürünler henüz fetch edilmedi.
  const [loading, setLoading] = useState(true);

  // error state'i fetch sırasında hata olursa hata mesajını tutar.
  // Başlangıçta null çünkü henüz hata yok.
  const [error, setError] = useState(null);

  // selectedProductId, detay modalında gösterilecek ürünün id bilgisini tutar.
  // Başlangıçta null çünkü seçili ürün yok.
  const [selectedProductId, setSelectedProductId] = useState(null);

  // currentCategory aktif seçili kategoriyi tutar.
  // "all" tüm kategoriler anlamına gelir.
  const [currentCategory, setCurrentCategory] = useState("all");

  // searchTerm arama inputuna yazılan metni tutar.
  // Başlangıçta boş string olduğu için arama filtresi uygulanmaz.
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect burada ürünleri public klasöründeki urunler.json dosyasından çekmek için kullanılır.
  // Boş dependency array olduğu için component ilk yüklendiğinde sadece bir kere çalışır.
  useEffect(() => {
    // fetch, tarayıcıda HTTP isteği atmamızı sağlayan JavaScript fonksiyonudur.
    // "/urunler.json" public klasöründeki dosyaya istek atar.
    fetch("/urunler.json")
      // İlk then içinde response kontrolü yapılır.
      .then((res) => {
        // res.ok false ise HTTP isteğinde sorun var demektir.
        // Örneğin 404 veya 500 gibi durumlarda burası çalışır.
        if (!res.ok) {
          // throw new Error ile bilinçli şekilde hata fırlatıyoruz.
          // Bu hata aşağıdaki catch bloğuna düşer.
          throw new Error(
            `Katalog yüklenemedi. Sunucu hata kodu: ${res.status}`,
          );
        }

        // response başarılıysa json formatına çeviriyoruz.
        // res.json() da promise döndürür.
        return res.json();
      })

      // JSON'a çevrilen veri data parametresine gelir.
      .then((data) => {
        // Gelen ürün listesini products state'ine atıyoruz.
        // State değiştiği için component yeniden render edilir.
        setProducts(data);

        // Veri başarıyla geldiği için loading false yapılır.
        setLoading(false);
      })

      // Fetch sırasında veya yukarıdaki then bloklarında hata olursa catch çalışır.
      .catch((err) => {
        // Hata mesajını error state'ine yazıyoruz.
        setError(err.message);

        // Hata olsa bile yükleme bittiği için loading false yapılır.
        setLoading(false);
      });
  }, []);

  // displayProducts, ekranda gösterilecek ürün listesini hazırlar.
  // useMemo kullanıyoruz çünkü bu hesaplama products, currentCategory veya sepet değişmedikçe tekrar yapılmasın.
  const displayProducts = useMemo(() => {
    // Önce kategori filtresi uygulanır.
    // Eğer currentCategory "all" ise tüm products listesi alınır.
    // Değilse sadece kategorisi currentCategory ile aynı olan ürünler alınır.
    const filtered =
      currentCategory === "all"
        ? products
        : products.filter((item) => item.kategori === currentCategory);

    // Burada filtrelenen ürünlerin stok bilgisi sepete göre yeniden hesaplanır.
    // Ama orijinal products state'i değiştirilmez.
    // map ile her ürün için yeni bir object döndürülür.
    return filtered.map((item) => {
      // sepet içinde bu üründen var mı diye arıyoruz.
      // find metodu şartı sağlayan ilk elemanı döndürür.
      // Eğer bulamazsa undefined döndürür.
      const sepetUrun = sepet.find((c) => c.id === item.id);

      // Eğer ürün sepette varsa sepetteki adedini alıyoruz.
      // Yoksa 0 kabul ediyoruz.
      const sepetAdet = sepetUrun ? sepetUrun.adet : 0;

      // Spread operator ile item içindeki tüm özellikleri kopyalıyoruz.
      // Sonra stok değerini ezip yeni stok değerini veriyoruz.
      // Math.max ile stok negatif görünmesin diye en düşük 0 yapıyoruz.
      return {
        ...item,
        stok: Math.max(0, item.stok - sepetAdet),
      };
    });

    // Bu useMemo sadece products, currentCategory veya sepet değişirse yeniden hesaplanır.
  }, [products, currentCategory, sepet]);

  // selectedProduct, seçili id'ye karşılık gelen ürün nesnesini bulur.
  // useMemo ile gereksiz find işlemleri azaltılır.
  const selectedProduct = useMemo(() => {
    // displayProducts içinde id'si selectedProductId ile eşleşen ürünü buluyoruz.
    // Eğer bulunamazsa null döndürülür.
    return displayProducts.find((p) => p.id === selectedProductId) || null;

    // selectedProductId veya displayProducts değişirse yeniden hesaplanır.
  }, [displayProducts, selectedProductId]);

  // handleSepeteEkle ürünü sepete ekleyen fonksiyondur.
  // useCallback kullanmamızın sebebi fonksiyonu gereksiz yere yeniden oluşturmamaktır.
  const handleSepeteEkle = useCallback((urun) => {
    // Eğer ürünün stoğu 0 veya daha azsa sepete ekleme işlemi yapılmaz.
    if (urun.stok <= 0) return;

    // setSepet ile sepet state'ini güncelliyoruz.
    // Burada functional update kullanıyoruz.
    // prevSepet, sepetin güncellemeden önceki en güncel halidir.
    setSepet((prevSepet) => {
      // Sepette bu ürün zaten var mı diye kontrol ediyoruz.
      const varOlan = prevSepet.find((item) => item.id === urun.id);

      // Eğer ürün sepette zaten varsa adetini 1 artırıyoruz.
      if (varOlan) {
        // map ile sepeti dolaşıyoruz.
        // id eşleşen üründe adet artırılır.
        // Diğer ürünler aynen korunur.
        return prevSepet.map((item) =>
          item.id === urun.id ? { ...item, adet: item.adet + 1 } : item,
        );
      }

      // Eğer ürün sepette yoksa yeni ürün olarak sepete eklenir.
      // Spread operator ile eski sepet korunur.
      // Sonuna yeni ürün objecti eklenir.
      return [
        ...prevSepet,
        { id: urun.id, ad: urun.ad, fiyat: urun.fiyat, adet: 1 },
      ];
    });

    // Dependency array boş çünkü bu fonksiyon dışarıdan değişen bir state'i direkt okumuyor.
    // setSepet React tarafından stabil geldiği için dependency'ye yazmaya gerek yoktur.
  }, []);

  // handleAdetGuncelle sepetteki ürün adedini artırıp azaltır.
  const handleAdetGuncelle = useCallback(
    (productId, yeniAdet) => {
      // Önce ana ürün listesinden ürünün gerçek stok bilgisini buluyoruz.
      const anaUrun = products.find((p) => p.id === productId);

      // Eğer ürün bulunamazsa işlem yapılmaz.
      if (!anaUrun) return;

      // Eğer yeni adet 0 veya daha küçükse ürün sepetten çıkarılır.
      if (yeniAdet <= 0) {
        // filter metodu şartı sağlayan elemanları yeni array olarak döndürür.
        // Burada id'si productId olmayan ürünler tutulur.
        // Yani seçilen ürün listeden çıkarılmış olur.
        setSepet((prev) => prev.filter((item) => item.id !== productId));
        return;
      }

      // Kullanıcı stoktan fazla ürün eklemeye çalışırsa engelliyoruz.
      if (yeniAdet > anaUrun.stok) {
        // alert ile kullanıcıya uyarı gösteriyoruz.
        alert(
          `Üzgünüz, bu üründen en fazla ${anaUrun.stok} adet ekleyebilirsiniz.`,
        );
        return;
      }

      // Yeni adet geçerliyse sepet state'i güncellenir.
      setSepet((prev) =>
        // map ile sepet ürünleri dolaşılır.
        // id eşleşen ürünün adedi yeniAdet yapılır.
        // Diğer ürünler değiştirilmeden bırakılır.
        prev.map((item) =>
          item.id === productId ? { ...item, adet: yeniAdet } : item,
        ),
      );

      // products değişirse bu fonksiyon yeniden oluşturulur.
      // Çünkü stok kontrolünde products kullanılıyor.
    },
    [products],
  );

  // handleUrunCikar sepetteki ürünü tamamen siler.
  const handleUrunCikar = useCallback((productId) => {
    // filter ile id'si productId olmayan ürünleri tutuyoruz.
    // Böylece seçilen ürün sepetten çıkarılmış oluyor.
    setSepet((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // handleCategoryChange kategori değişimini yönetir.
  const handleCategoryChange = useCallback((newCat) => {
    // currentCategory state'ini yeni kategori ile güncelliyoruz.
    setCurrentCategory(newCat);
  }, []);

 
  return (
    <div className="app-container">
      {/* Baslik componentine gerekli propsları gönderiyoruz.
          Bu component arama inputu, kategori bilgisi ve sepet butonunu gösterir. */}
      <Baslik
        // env prop'u aktif kategori bilgisidir.
        env={currentCategory}
        // sepetAdedi sepetteki toplam ürün sayısıdır.
        // reduce ile tüm ürün adetleri toplanır.
        sepetAdedi={sepet.reduce((sum, item) => sum + item.adet, 0)}
        // Sepet butonuna basıldığında sepetAcik true yapılır.
        // Böylece SepetGezgini componenti görünür hale gelir.
        onSepetAc={() => setSepetAcik(true)}
        // searchVal arama inputunun değeridir.
        searchVal={searchTerm}
        // onSearchChange input değiştikçe searchTerm state'ini günceller.
        onSearchChange={setSearchTerm}
      />

      {/* KampanyaBanner kendi içinde sayaç tuttuğu için burada ekstra prop almıyor. */}
      <KampanyaBanner />

      {/* UrunListesi componentine ürünler ve gerekli event fonksiyonları gönderiliyor. */}
      <UrunListesi
        // displayProducts, kategori ve sepet stok durumuna göre hazırlanmış ürün listesidir.
        products={displayProducts}
        // loading bilgisi ürün listesinde skeleton göstermek için kullanılır.
        loading={loading}
        // error varsa ürün listesinde hata mesajı göstermek için kullanılır.
        error={error}
        // activeCategory seçili kategori butonunu aktif göstermek için kullanılır.
        activeCategory={currentCategory}
        // Kategori değişince çalışacak fonksiyon.
        onCategoryChange={handleCategoryChange}
        // Ürün kartına tıklanınca seçili ürün id'si state'e yazılır.
        // Bu state dolunca UrunDetayi modalı açılır.
        onSelectProduct={(item) => setSelectedProductId(item.id)}
        // Sepete ürün eklemek için gönderilen fonksiyon.
        onSepeteEkle={handleSepeteEkle}
        // Arama filtresi için kullanılan metin.
        searchTerm={searchTerm}
      />

      {/* SepetGezgini sepetteki ürünleri ve ödeme özetini gösterir. */}
      <SepetGezgini
        // Sepet içeriği gönderilir.
        sepet={sepet}
        // Sepet açık mı kapalı mı bilgisi gönderilir.
        isOpen={sepetAcik}
        // Sepeti kapatacak fonksiyon gönderilir.
        onClose={() => setSepetAcik(false)}
        // Ürün adedini güncelleyen fonksiyon gönderilir.
        onAdetGuncelle={handleAdetGuncelle}
        // Ürünü sepetten çıkaran fonksiyon gönderilir.
        onUrunCikar={handleUrunCikar}
      />

      {/* selectedProductId doluysa ürün detay modalını gösteriyoruz.
          Bu conditional rendering örneğidir.
          selectedProductId null ise UrunDetayi hiç render edilmez. */}
      {selectedProductId && (
        <UrunDetayi
          // selectedProduct, id'ye göre bulunmuş ürün objectidir.
          product={selectedProduct}
          // Modal kapanınca selectedProductId null yapılır.
          // Böylece modal ekrandan kalkar.
          onClose={() => setSelectedProductId(null)}
          // Modal içinden sepete ekleme yapılabilmesi için fonksiyon gönderilir.
          onSepeteEkle={handleSepeteEkle}
        />
      )}
    </div>
  );
}
