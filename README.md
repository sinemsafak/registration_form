
# registration_form

React web ve Flutter mobil kayıt formu projesi.

## Gereksinimler

- Node.js LTS ve npm
- Git
- Flutter SDK ve Dart

## Kurulum

Proje kök klasöründe:

```bash
npm install
```

Flutter bağımlılıkları:

```bash
cd apps/flutter_app
flutter pub get
cd ../..
```

## Sunucuyu çalıştırma

Proje kök klasöründe:

```bash
npm run dev:server
```

Sunucu varsayılan olarak http://localhost:3000 adresinde çalışır.

Sağlık kontrolü:

```bash
curl http://localhost:3000/health
```

## React uygulamasını çalıştırma

İkinci terminalde proje kök klasöründe:

```bash
npm run dev:web
```

Terminalde gösterilen yerel adresi tarayıcıda aç.

## Test ve derleme

```bash
npm test
npm run build
```

Flutter testleri:

```bash
cd apps/flutter_app
flutter test
flutter analyze
```

## Güvenlik notları

- Sunucu doğrulaması istemci doğrulamasından bağımsız çalışır.
- Parola ve form verileri uygulama tarafından loglanmaz.
- Demo sürümü veritabanına hesap kaydetmez.
- Gerçek kullanım için HTTPS, veritabanı, parola hashleme,
  hız sınırlama ve e-posta doğrulaması eklenmelidir.
- .env ve .env.local dosyaları Git'e gönderilmemelidir.
