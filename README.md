# PlayerPulseMobil

Futbol takımı yönetimi mobil uygulaması. Antrenörlerin/menajerlerin takımları, oyuncuları, antrenmanları ve maçları yönetmesini; oyuncuların kendi performans ve gelişim verilerini görüntülemesini sağlar.

## Teknoloji

- **Expo SDK 54** + Expo Router 6 (dosya tabanlı yönlendirme)
- **React 19** + React Native 0.81
- **TypeScript** (strict mode)
- **TanStack Query** (sunucu state'i)
- **Zustand** (auth state'i, SecureStore ile kalıcı)
- **React Hook Form** + **Zod** (form yönetimi ve validation)
- **Axios** (Bearer token interceptor, 401 → otomatik logout)

## Kurulum

### Önkoşullar
- **Node.js 20+** ve **npm**
- **Git**
- Mobil çalıştırma için: **Android Studio** (emulator veya gerçek cihaz + USB hata ayıklama) ya da **Xcode** (iOS, yalnız macOS)
- PC'de tercihen **PHP 8.2+** ile çalışan [PlayerPulse backend](https://github.com/sudeduz04/PlayerPulse) (ayrı repo)

### 1) Bağımlılıkları kur
```bash
git clone https://github.com/sudeduz04/PlayerPulseMobil.git
cd PlayerPulseMobil
npm install
```

### 2) `.env` dosyasını oluştur
`.env` git tarafından izlenmez — her geliştiricinin kendi makinesine göre oluşturması gerekir.
```bash
cp .env.example .env
```

Sonra `.env`'i düzenleyip `EXPO_PUBLIC_API_URL`'i hedefine göre ayarla:

| Senaryo | `EXPO_PUBLIC_API_URL` |
|---|---|
| Android **emulator** + backend aynı PC'de | `http://10.0.2.2:8000/api` |
| iOS **simulator** + backend aynı Mac'te | `http://127.0.0.1:8000/api` |
| **Gerçek cihaz** + backend aynı LAN'da | `http://<PC-LAN-IP>:8000/api` (örn. `http://192.168.1.42:8000/api`) |
| Uzak/staging backend | `https://api.playerpulse.example/api` |

PC'nin LAN IP'sini bulmak için:
- **Windows**: PowerShell'de `ipconfig` → "IPv4 Address" satırı (örn `192.168.1.42`)
- **macOS/Linux**: `ifconfig | grep "inet "` veya `ip addr`

### 3) Backend'i başlat (yerel kullanım)
Backend ayrı bir repoda. Mobil uygulama API olmadan **boş ekranlar gösterir**, mock veri kullanmaz.

PlayerPulse backend klasöründe:
```bash
# Tüm interface'leri dinleyecek şekilde başlat — sadece localhost değil
php artisan serve --host=0.0.0.0 --port=8000
```

**Önemli**: `php artisan serve` varsayılan olarak yalnız `127.0.0.1`'ı dinler. Gerçek cihaz / farklı emulator bu durumda PC'ye **erişemez**; `--host=0.0.0.0` zorunludur. Windows Firewall ilk seferde izin sorabilir, "Allow access" de.

### 4) Mobil uygulamayı başlat

#### Android (emulator veya USB cihaz)
1. Android Studio'da bir AVD başlat **veya** USB hata ayıklama açık bir cihazı bağla.
2. `adb devices` ile cihazın `device` olarak listelendiğini doğrula.
3. Aşağıdaki komutu çalıştır:
   ```bash
   npm run android
   ```
   Bu Metro bundler'ı açar, JS bundle'ı derler ve Expo Go (veya dev build) ile cihazda açılır.

#### iOS (yalnız macOS)
```bash
npm run ios
```

#### Web (sınırlı destek — saha SVG'si ve native modüller çalışmayabilir)
```bash
npm run web
```

### 5) Doğrulama
- Uygulama açılınca login ekranı gelmeli.
- Backend kullanıcı adıyla giriş yap → rol bazlı dashboard yüklenir.
- Eğer "Network error" görürsen kontrol et:
  - Backend `0.0.0.0:8000` üzerinde çalışıyor mu? (`netstat -ano | findstr 8000` / `lsof -i :8000`)
  - `.env`'deki IP doğru mu? Cihaz aynı LAN'da mı?
  - PC'de güvenlik duvarı `8000` portunu engelliyor mu?
- API URL'i değiştirdiysen Metro'yu **`--clear`** ile yeniden başlat: `npx expo start --clear --android`. `EXPO_PUBLIC_*` değişkenleri build-time inject edildiği için cache temizliği gerekir.

`.env` değişkenleri:
- `EXPO_PUBLIC_API_URL` — Backend API base URL (yukarıdaki tabloya bak).
- `EXPO_PUBLIC_ENV` — `development` / `production`.

### Yaygın Sorunlar
| Belirti | Çözüm |
|---|---|
| `Port 8081 is being used` | Eski Metro process'i: `taskkill /F /IM node.exe` (Windows) ya da `lsof -ti:8081 \| xargs kill -9` |
| `Network error` cihazda | Backend `--host=0.0.0.0` ile başlatılmamış veya `.env`'deki IP yanlış |
| `Cannot find module 'expo-document-picker'` vb. | `npm install` yeniden çalıştır + Metro `--clear` |
| Çift firma uyumsuzluk uyarısı (peer deps) | `npx expo install --check` ile sürümleri uyumlu hale getir |
| AVD açık ama `npm run android` cihaz bulamıyor | `adb kill-server && adb start-server` |

## Klasör Yapısı

```
app/                 # Expo Router ekranları
  (auth)/            # Giriş ekranları
  (app)/             # Korumalı ekranlar (players, teams, trainings, matches)
src/
  api/               # Axios client + endpoint fonksiyonları + types
  components/ui/     # Paylaşılan UI bileşenleri (Button, Card, Toast, ...)
  features/          # Domain başına: hooks, schemas, forms, list itemları
    players/
    teams/
    trainings/
    matches/
    dashboard/
    playerDashboard/
  hooks/             # Genel React hooks
  lib/               # Saf yardımcılar (format, permissions, roles, storage, config)
  store/             # Zustand store'ları (auth)
  theme/             # tokens (renkler, radius, spacing)
```

## Roller

Uygulama 4 rol destekler (`src/lib/roles.ts`):

| Rol | Erişim |
|---|---|
| `super_admin` | Tam yetki — tüm takımları/oyuncuları yönetir |
| `manager` | Takım, oyuncu, antrenman, maç oluşturma/düzenleme |
| `coach` | Antrenman ve maç düzenleme, oyuncu görüntüleme |
| `player` | Sadece kendi gösterge paneli (gelişim, antrenman performansı, maç istatistiği) |

Yetki kontrolleri `src/lib/permissions.ts` içinde merkezileştirilmiştir.

## Scriptler

```bash
npm run start       # Expo dev server
npm run android     # Android'de çalıştır
npm run ios         # iOS'de çalıştır
npm run web         # Web'de çalıştır
npm run lint        # ESLint
```

## Geliştirme Notları

- **Yeni mimari** (`newArchEnabled: true`) ve **React Compiler** açıktır — manuel `useMemo`/`useCallback` çoğunlukla gereksizdir.
- Liste ekranları `FlatList` + memoize'lenmiş item bileşenleri kullanır (`src/features/<entity>/components/*ListItem.tsx`).
- Form bileşenleri `Control<TFormValues>` ile tipliidir; schema'lar `src/features/<entity>/schemas.ts` içindedir.
- API hataları `extractErrorMessage` ile parse edilir; `useToast()` ile kullanıcıya gösterilir.
- 401 yanıtı geldiğinde `useUnauthorizedHandler` otomatik logout yapar.

## Backend

Backend Laravel tabanlıdır (ayrı repo). API response formatı:
```ts
{ success: true, data: T } | { success: false, message: string, errors?: Record<string, string[]> }
```

## CI

`.github/workflows/ci.yml` — push ve PR'larda `tsc --noEmit` + `npm run lint` çalıştırır.
