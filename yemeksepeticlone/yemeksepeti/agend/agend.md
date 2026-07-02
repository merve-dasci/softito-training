# AGEND.md

## Antigravity İçin Görev Talimatı

Bu projeyi React, Redux Toolkit ve JSON Server kullanarak oluştur.

Proje Yemeksepeti benzeri bir yemek sipariş sistemi olacak. Sistemde login olacak ve login olan kullanıcının rolüne göre farklı panel açılacak.

Toplam üç panel olacak:

* Admin Panel
* Customer Panel
* User Panel

## Genel Beklenti

Projeyi birkaç saat içinde tamamlanabilecek şekilde sade ama çalışır geliştir.

Kodlar temiz, anlaşılır ve component yapısına uygun olsun.

Proje gerçek bir backend olmadan JSON Server ile çalışacak.

## Yapılacaklar

### 1. Proje Kurulumu

React projesi oluştur.

Gerekli paketleri kur:

```bash
npm install @reduxjs/toolkit react-redux react-router-dom axios json-server
```

JSON Server için script ekle:

```json
"server": "json-server --watch db.json --port 3001"

```

Antigravity projeyi React + JavaScript + JSX formatında oluşturmalı. TypeScript kullanılmamalı.

### 2. Routing Yapısı

React Router kullan.

Route yapısı:

```txt
/
/login
/register
/admin
/customer
/user
/restaurants/:id
/cart
```

Bilinmeyen route için NotFound sayfası oluştur.

### 3. Login Sistemi

Login sayfasında email ve password alanları olsun.

Kullanıcı bilgisi JSON Server içindeki users datasından kontrol edilsin.

Başarılı girişten sonra kullanıcı bilgisi Redux authSlice içine kaydedilsin.

Ayrıca localStorage içine de user bilgisi kaydedilsin.

Logout işleminde Redux ve localStorage temizlensin.

### 4. Role Göre Yönlendirme

Login sonrası:

* role admin ise `/admin`
* role customer ise `/customer`
* role user ise `/user`

sayfasına yönlendir.

ProtectedRoute componenti oluştur.

Admin olmayan biri admin paneline giremesin.

Login olmayan biri panel sayfalarına giremesin.

### 5. Home Page

Ana sayfada şunlar olsun:

* Navbar
* Hero section
* Popüler restoranlar
* Kategoriler
* Öne çıkan yemekler
* Login / Logout butonu

Restoran kartlarında:

* Görsel
* Restoran adı
* Kategori
* Puan
* Teslimat süresi
* Detaya git butonu

### 6. Customer Panel

Customer panelde müşteri yemek sipariş edebilsin.

Özellikler:

* Restoranları listele
* Restoran detayına git
* Ürünleri gör
* Sepete ürün ekle
* Sepeti görüntüle
* Sipariş oluştur
* Siparişlerim alanında kendi siparişlerini gör

### 7. Sepet Sistemi

Redux cartSlice oluştur.

Sepet özellikleri:

* Ürün ekle
* Ürün çıkar
* Ürün adedi artır
* Ürün adedi azalt
* Sepeti temizle
* Toplam fiyat hesapla

Sepet sayfasında sipariş oluştur butonu olsun.

Sipariş oluşturulunca orders endpointine POST isteği atılsın.

Sipariş oluşturulduktan sonra sepet temizlensin.

### 8. Admin Panel

Admin panel tüm sistemi yönetsin.

Admin dashboard içinde kartlar olsun:

* Toplam sipariş
* Toplam restoran
* Toplam ürün
* Toplam kullanıcı

Admin panelde en az bir tane data table mutlaka kullanılmalı.

Data table siparişleri göstermeli.

Data table kolonları:

* ID
* Müşteri
* Restoran
* Toplam Tutar
* Durum
* Tarih
* İşlem

Admin sipariş durumunu değiştirebilmeli.

Durum seçenekleri:

* Hazırlanıyor
* Yolda
* Teslim edildi
* İptal edildi

### 9. Admin Ürün Yönetimi

Admin ürünleri listeleyebilsin.

Admin yeni ürün ekleyebilsin.

Ürün alanları:

* Ürün adı
* Açıklama
* Fiyat
* Görsel URL
* Restoran ID

Admin ürün silebilsin.

### 10. Admin Restoran Yönetimi

Admin restoranları listeleyebilsin.

Yeni restoran ekleyebilsin.

Restoran alanları:

* Restoran adı
* Kategori
* Puan
* Teslimat süresi
* Görsel URL

Restoran silebilsin.

### 11. User Panel

User panel basit bir genel kullanıcı paneli olsun.

İçerikler:

* Kullanıcı adı
* Email
* Rol bilgisi
* Sisteme genel bakış
* Restoranları görüntüle butonu

### 12. Tasarım

Tasarım sade ve modern olsun.

Yemeksepeti tarzına uygun olarak:

* Kırmızı / pembe tonları
* Beyaz arka plan
* Kart yapıları
* Rounded köşeler
* Hover efektleri
* Responsive grid yapısı

Admin panel daha dashboard tarzında olsun.

Customer panel daha alışveriş sitesi gibi olsun.

### 13. Etkileşimler

Projede mutlaka şu etkileşimler çalışmalı:

* Login
* Logout
* Role göre yönlendirme
* Restoran detayına gitme
* Sepete ürün ekleme
* Sepetten ürün silme
* Ürün adedi değiştirme
* Sipariş oluşturma
* Admin sipariş durumunu güncelleme
* Admin ürün ekleme
* Admin ürün silme
* Admin restoran ekleme
* Admin restoran silme

### 14. Öncelikli Tamamlama Planı

Önce çalışan sistemi kur.

Sıralama:

1. JSON Server datası
2. Login
3. Routing
4. Redux store
5. Restoran listeleme
6. Ürün listeleme
7. Sepet
8. Sipariş oluşturma
9. Admin panel
10. Data table
11. Ürün / restoran ekleme silme
12. CSS düzenleme

## Dil ve Dosya Formatı

Proje JavaScript + JSX ile geliştirilecektir.

- TypeScript kullanılmayacak.
- Tüm React component dosyaları `.jsx` uzantılı olacak.
- Redux slice dosyaları `.js` uzantılı olacak.
- Store dosyası `.js` olacak.
- Componentlerde `function ComponentName()` veya `const ComponentName = () => {}` yapısı kullanılabilir.
- TypeScript tipi, interface, type tanımı kullanılmayacak.

## Tasarım Planı

Proje modern, koyu temalı ve profesyonel bir yemek sipariş sistemi görünümünde olacaktır.

Ana renk paleti:

- Bordo: #7A1E2C
- Koyu bordo: #4A0F1C
- Siyah: #0B0B0F
- Koyu gri: #17171C
- Açık gri yazı: #D1D5DB
- Beyaz: #FFFFFF
- Vurgu rengi: #B83246

Tasarım stili:

- Koyu arka plan
- Bordo vurgu butonları
- Siyah / koyu gri kartlar
- Beyaz ve açık gri metinler
- Rounded kart yapısı
- Hover efektleri
- Modern dashboard görünümü
- Admin panelde koyu sidebar
- Customer panelde kart tabanlı restoran ve yemek listesi
- User panelde sade profil kartları

Admin panel tasarımı:

- Sol tarafta koyu sidebar
- Üstte admin başlığı
- Dashboard kartları
- Bordo aksiyon butonları
- Siyah zeminli data table
- Durum badge’leri

Customer panel tasarımı:

- Restoran kartları
- Yemek kartları
- Sepet özeti
- Bordo “Sepete Ekle” butonları
- Koyu tema ile modern alışveriş görünümü

Navbar tasarımı:

- Siyah arka plan
- Bordo logo alanı
- Beyaz menü yazıları
- Hover durumunda bordo vurgu

## UI/UX Kuralları

- Hiçbir yerde `window.alert()` kullanılmayacak.
- Hiçbir yerde `confirm()` veya `prompt()` kullanılmayacak.
- Tüm kullanıcı bildirimleri modern toast (toaster) sistemi ile gösterilecek.
- Toast bildirimleri sağ üst köşede görüntülenecek.
- Bildirimler animasyonlu olacak ve birkaç saniye sonra otomatik kapanacak.
- Başarılı işlemler yeşil tonlarında gösterilecek.
- Hata mesajları kırmızı tonlarında gösterilecek.
- Uyarılar turuncu tonlarında gösterilecek.
- Bilgilendirme mesajları mavi tonlarında gösterilecek.

Tercih edilen kütüphane:

- react-hot-toast (öncelikli)
- Alternatif olarak sonner kullanılabilir.

Toast kullanılacak işlemler:

- Giriş başarılı
- Giriş başarısız
- Çıkış yapıldı
- Sepete ürün eklendi
- Sepetten ürün silindi
- Sipariş oluşturuldu
- Ürün eklendi
- Ürün güncellendi
- Ürün silindi
- Restoran eklendi
- Restoran silindi
- Sipariş durumu güncellendi
- Form doğrulama hataları
- Sunucu/API hataları

Proje genelinde kullanıcı deneyimini bozan klasik popup'lar yerine yalnızca modern toast bildirimleri kullanılacaktır.

### 15. Önemli Not

Bu proje ödev / sunum için hazırlanıyor. Bu yüzden öncelik görsel mükemmellik değil, çalışan fonksiyonel sistem olmalıdır.

Kodlar çalışır, anlaşılır ve sunumda açıklanabilir olmalıdır.
