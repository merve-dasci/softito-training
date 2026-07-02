# SKILL.md

## Projede Kullanılacak Tekniler

Bu proje React, Redux Toolkit ve JSON Server kullanılarak geliştirilecek bir Yemeksepeti benzeri yemek sipariş uygulamasıdır.

## Kullanılacak Temel Teknolojiler

* React
* Redux Toolkit
* React Router DOM
* JSON Server
* Axios
* CSS / Tailwind / sade responsive tasarım
* LocalStorage

## Temel Kurallar

* Proje birkaç saat içinde tamamlanabilecek seviyede tutulmalıdır.
* Kodlar gereksiz karmaşık olmamalıdır.
* Component yapısı temiz ve anlaşılır olmalıdır.
* Redux yalnızca global state gereken alanlarda kullanılmalıdır.
* JSON Server gerçek backend gibi kullanılmalıdır.
* Login sistemi basit ama çalışır olmalıdır.
* Admin, müşteri ve kullanıcı paneli ayrı sayfalar olarak tasarlanmalıdır.
* En az bir adet data table admin panelinde bulunmalıdır.
* Sepete ürün ekleme, çıkarma, sipariş oluşturma gibi etkileşimler çalışmalıdır.

## Redux Kullanımı

Redux içinde şu slice yapıları kullanılabilir:

* authSlice
* restaurantsSlice
* productsSlice
* cartSlice
* ordersSlice

## Sayfa Yapısı

Proje içinde şu sayfalar olmalıdır:

* Login
* Register
* Home
* RestaurantDetail
* Cart
* CustomerPanel
* AdminPanel
* UserPanel
* NotFound

## Yetkilendirme

Kullanıcı rolleri:

* admin
* customer
* user

Login olan kişinin rolüne göre yönlendirme yapılmalıdır.

Admin:

* Admin paneline girebilir.
* Restoranları yönetebilir.
* Ürünleri yönetebilir.
* Siparişleri data table üzerinden görüntüleyebilir.

Customer:

* Yemekleri listeleyebilir.
* Sepete ürün ekleyebilir.
* Sipariş verebilir.
* Kendi siparişlerini görebilir.

User:

* Genel kullanıcı paneline girebilir.
* Profil bilgilerini ve sistem özetini görebilir.

## Kodlama Standartları

* Component isimleri PascalCase olmalıdır.
* Fonksiyon isimleri açıklayıcı olmalıdır.
* API istekleri ayrı servis dosyalarında tutulmalıdır.
* Gereksiz tekrar eden kodlardan kaçınılmalıdır.
* Formlarda basit validation yapılmalıdır.
* Hatalı girişlerde kullanıcıya mesaj gösterilmelidir.

## JSON Server Yapısı

`db.json` içinde şu koleksiyonlar bulunmalıdır:

* users
* restaurants
* products
* orders
* categories

## UI Standartları

- Modern kullanıcı deneyimi hedeflenmelidir.
- Alert, confirm ve prompt kullanılmamalıdır.
- Tüm bildirimler toast sistemi ile verilmelidir.

## Önemli Özellikler

* Login / logout
* Role göre panel yönlendirme
* Restoran listeleme
* Ürün listeleme
* Sepete ekleme
* Sepetten çıkarma
* Sipariş oluşturma
* Admin data table
* Admin ürün ekleme / silme
* Sipariş durum güncelleme
* Responsive görünüm

## Dil ve Dosya Formatı

Proje JavaScript + JSX ile geliştirilecektir.

- TypeScript kullanılmayacak.
- Tüm React component dosyaları `.jsx` uzantılı olacak.
- Redux slice dosyaları `.js` uzantılı olacak.
- Store dosyası `.js` olacak.
- Componentlerde `function ComponentName()` veya `const ComponentName = () => {}` yapısı kullanılabilir.
- TypeScript tipi, interface, type tanımı kullanılmayacak.
