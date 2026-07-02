# PROJECT.md

## Proje Adı

Delicious Admin & Customer Management System

## Proje Açıklaması

Bu proje, Yemeksepeti benzeri basit bir yemek sipariş sistemidir. Kullanıcılar sisteme giriş yapabilir, restoranları ve yemekleri görüntüleyebilir, sepete ürün ekleyebilir ve sipariş oluşturabilir. Admin paneli üzerinden restoranlar, yemekler ve siparişler yönetilebilir.

Projede üç temel panel bulunacaktır:

1. Kullanıcı Paneli
2. Müşteri Paneli
3. Admin Paneli

## Projenin Amacı

Bu projenin amacı React, Redux ve JSON Server kullanarak etkileşimli, yönetilebilir ve rol bazlı çalışan bir yemek sipariş sistemi geliştirmektir.

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

## Kullanıcı Rolleri

### Admin

Admin tüm sistemi yönetir.

Admin özellikleri:

* Admin dashboard görüntüleme
* Toplam sipariş sayısını görme
* Toplam kullanıcı sayısını görme
* Toplam restoran sayısını görme
* Siparişleri data table içinde listeleme
* Sipariş durumunu güncelleme
* Ürün ekleme
* Ürün silme
* Restoran ekleme
* Restoran silme

### Customer

Customer yani müşteri sipariş veren kullanıcıdır.

Customer özellikleri:

* Restoranları görüntüleme
* Yemekleri görüntüleme
* Sepete yemek ekleme
* Sepetten yemek çıkarma
* Sipariş oluşturma
* Kendi siparişlerini görme
* Sipariş durumunu takip etme

### User

User genel kullanıcı paneline sahip sistem kullanıcısıdır.

User özellikleri:

* Profil bilgilerini görme
* Sistemdeki genel restoranları görme
* Kullanıcı panelinden müşteri paneline geçiş yapabilme
* Hesap bilgilerini görüntüleme

## Sayfalar

### Login Page

Kullanıcı email ve şifre ile giriş yapar.

Login sonrası role göre yönlendirme yapılır:

* admin → `/admin`
* customer → `/customer`
* user → `/user`

### Home Page

Genel karşılama sayfasıdır.

İçerikler:

* Hero alanı
* Popüler restoranlar
* Kategoriler
* Öne çıkan yemekler
* Login butonu

### Admin Panel

Admin panelinde sistem yönetimi yapılır.

Alanlar:

* Dashboard kartları
* Sipariş data table
* Ürün yönetimi
* Restoran yönetimi

Data table kolonları:

* Sipariş ID
* Müşteri adı
* Restoran adı
* Toplam tutar
* Sipariş durumu
* Tarih
* İşlem

Sipariş durumları:

* Hazırlanıyor
* Yolda
* Teslim edildi
* İptal edildi

### Customer Panel

Müşteri yemek siparişi verir.

Alanlar:

* Restoran listesi
* Yemek listesi
* Sepet
* Siparişlerim

### User Panel

Genel kullanıcı panelidir.

Alanlar:

* Profil bilgileri
* Kullanıcı rolü
* Sisteme genel bakış
* Restoranlara git butonu

### Restaurant Detail Page

Seçilen restorana ait yemekler listelenir.

Her yemek kartında:

* Yemek görseli
* Yemek adı
* Açıklama
* Fiyat
* Sepete ekle butonu

### Cart Page

Sepetteki ürünler gösterilir.

Özellikler:

* Ürün adedi artırma
* Ürün adedi azaltma
* Ürün silme
* Toplam fiyat hesaplama
* Sipariş oluşturma

## JSON Server db.json Örneği

```json
{
  "users": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@test.com",
      "password": "123456",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Customer User",
      "email": "customer@test.com",
      "password": "123456",
      "role": "customer"
    },
    {
      "id": 3,
      "name": "Normal User",
      "email": "user@test.com",
      "password": "123456",
      "role": "user"
    }
  ],
  "restaurants": [
    {
      "id": 1,
      "name": "Burger House",
      "category": "Burger",
      "rating": 4.6,
      "deliveryTime": "25-35 dk",
      "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
    }
  ],
  "products": [
    {
      "id": 1,
      "restaurantId": 1,
      "name": "Cheeseburger Menü",
      "description": "Burger, patates ve içecek",
      "price": 220,
      "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
    }
  ],
  "orders": [
    {
      "id": 1,
      "userId": 2,
      "customerName": "Customer User",
      "restaurantName": "Burger House",
      "items": [
        {
          "productId": 1,
          "name": "Cheeseburger Menü",
          "quantity": 1,
          "price": 220
        }
      ],
      "totalPrice": 220,
      "status": "Hazırlanıyor",
      "date": "2026-07-02"
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Burger"
    },
    {
      "id": 2,
      "name": "Pizza"
    },
    {
      "id": 3,
      "name": "Döner"
    }
  ]
}
```

## Klasör Yapısı

```txt
src/
  app/
    store.js

  features/
    auth/
      authSlice.js
    restaurants/
      restaurantsSlice.js
    products/
      productsSlice.js
    cart/
      cartSlice.js
    orders/
      ordersSlice.js

  services/
    api.js
    authService.js
    restaurantService.js
    productService.js
    orderService.js

  components/
    Navbar.jsx
    ProtectedRoute.jsx
    RestaurantCard.jsx
    ProductCard.jsx
    CartItem.jsx
    DataTable.jsx
    AdminSidebar.jsx

  pages/
    Login.jsx
    Register.jsx
    Home.jsx
    AdminPanel.jsx
    CustomerPanel.jsx
    UserPanel.jsx
    RestaurantDetail.jsx
    Cart.jsx
    NotFound.jsx

  App.jsx
  main.jsx
  index.css
```

## Öncelikli Geliştirme Sırası

1. Projeyi oluştur.
2. JSON Server kur.
3. db.json hazırla.
4. Redux store kur.
5. authSlice oluştur.
6. Login sistemini yap.
7. Role göre yönlendirme yap.
8. Home sayfasını hazırla.
9. Restoranları listele.
10. Restoran detayında ürünleri listele.
11. Sepete ekleme sistemini yap.
12. Sipariş oluşturmayı yap.
13. Admin panelini yap.
14. Admin data table ekle.
15. Sipariş durumu güncelleme özelliği ekle.
16. Ürün ekleme / silme özelliği ekle.
17. Tasarımı toparla.
18. Test et ve commit at.

## Dil ve Dosya Formatı

Proje JavaScript + JSX ile geliştirilecektir.

- TypeScript kullanılmayacak.
- Tüm React component dosyaları `.jsx` uzantılı olacak.
- Redux slice dosyaları `.js` uzantılı olacak.
- Store dosyası `.js` olacak.
- Componentlerde `function ComponentName()` veya `const ComponentName = () => {}` yapısı kullanılabilir.
- TypeScript tipi, interface, type tanımı kullanılmayacak.

## Demo Kullanıcı Bilgileri

Admin:

```txt
email: admin@test.com
password: 123456
```

Customer:

```txt
email: customer@test.com
password: 123456
```

User:

```txt
email: user@test.com
password: 123456
```
