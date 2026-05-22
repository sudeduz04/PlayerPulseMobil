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

```bash
# 1. Bağımlılıkları kur
npm install

# 2. Environment'ı yapılandır
cp .env.example .env
# .env'i düzenle: EXPO_PUBLIC_API_URL=<backend-url>

# 3. Çalıştır
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web (sınırlı)
```

`.env` değişkenleri:
- `EXPO_PUBLIC_API_URL` — Backend API base URL. Geliştirmede Android emulator için `http://10.0.2.2:8000/api`.
- `EXPO_PUBLIC_ENV` — `development` / `production`.

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
