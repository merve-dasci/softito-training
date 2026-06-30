## Projenin Amacı
# 1. Adım
Bu projede otobüs uçak biletleri arayabilmek ve otobüs ucuz uça bileti almak için tasarlanacaktır.
Projede Anasayfa, Login, Register, Filtre Sayfası ve Detay Sayfası olacaktır.

# 2. Adım
Anasayfada Header altında bir arama barı içinde uçak otobüs tabları ile tarih seçimi yaparak bilet arama işlemi yapabiliyor olacağız. 
Arama barı arkasında bir tatil resimi ya da uçak otobüs resmi background image olarak kullanılacak sonrasında şirket hakkımızda kartları vizyon misyon kartları altında standart olan  örnek: istanbul ankara otobüs İstanbul ankara uçak vb. şeklinde hazır biletler fiyatlarıyla olacak onun altında tüm sayfalara gidebileceğimiz footer alanları olacak.

# 3. Adım
Login ekranında email ve şifre ile giriş yapılacak giriş yapınca direkt anasayfaya gönderebiliriz headerda login yazan yerde ise kullanıcının adı soyadı olacak.

# 4. Adım
Register ekranında ad soyad telefon email kullanım koşullarını kabul ediyorum checkbox olacak ve kvkk kesinlikle modal olarak açılacak.

# 5. Adım
Filtre sayfasında sol tarafta tarih seçimi değiştirme, otobüs uçak seçimi değiştirme, fiyata göre filtreleme, koltuğa göre filtreleme gibi alanlar olacak.
sağ tarafta ise listeleme yapılacak ve her listelenen biletin detay sayfasına yönlendirilecek buton olacak.
# 6. Adım
detay sayfasında otobüs için koltuk seçimi yapılcak ve ödeme yap ekranına yönlendirecek buton olacak ve ödeme sayfasına yönlendirip ödemeniz başarılı ya da başarısız sayfalarına gönderilecek şekilde bir ödeme simülasyonu yapılacaktır.

# Teknik Gereksinimler
# 1. Adım
Kesinlikle React Vite, redux , tailwind CSS kullanılacak kütüphane sayısı sınırlandırılacak gereksiz kütüphanelerden kaçınılacaktır. Her sayfada emajiler ve gereksiz yorum satırları olmayacak.
# 2. Adım
db.json dosyası hazırlanıp static veriler bu dosyada tutulacak olup json-server ile ayağa kaldırılacak ve tüm sayfalarda bu verileri kullanacağız. Ayrıca direkt db.json üzerindeki dosyada güncelleme ekleme silme vb. işlemleri de yapıp sistemi sayfa yenilendiğinde sıfırdan başlama özelliğinden kurtaracağız.
