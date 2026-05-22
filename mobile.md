# Mobil Uygulama Rehberi (React Native + Expo)

Bu kısa rehber, PlayerPulse web panelinin yanına bir mobil istemci eklemek isteyenler için. Backend tamamen hazır — mobile yalnızca `/api/*` endpoint'lerini tüketir.

## Önerilen Stack

- **React Native + Expo** (kurulum ve build kolay)
- **TypeScript**
- **Axios** — API çağrıları
- **React Query (@tanstack/react-query)** — server state + polling
- **React Navigation** — stack + bottom tabs
- **React Native Async Storage** — token saklama
- **NativeWind** (Tailwind for RN) — web tarafıyla aynı sınıf mantığı
- **react-native-svg** — saha çizimi
- **react-native-markdown-display** — AI analiz çıktısı render

## Başlangıç

```bash
npx create-expo-app playerpulse-mobile -t expo-template-blank-typescript
cd playerpulse-mobile
npm i axios @tanstack/react-query @react-navigation/native @react-navigation/native-stack \
      @react-navigation/bottom-tabs @react-native-async-storage/async-storage nativewind \
      react-native-svg react-native-markdown-display
npx expo install react-native-screens react-native-safe-area-context
```

`.env`'ye base URL:

```
EXPO_PUBLIC_API_URL=https://api.playerpulse.app/api
```

## Auth Akışı

1. `POST /api/login` → token cevapta gelir
2. `AsyncStorage.setItem('token', token)`
3. Axios interceptor her isteğe `Authorization: Bearer ...` ekler
4. 401 alınca login ekranına yönlendir

```ts
// lib/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## Ekran ↔ Web Sayfa Eşleştirmesi

| Mobil Ekran                    | Web Karşılığı                                                                           | Kullandığı Endpoint(ler)                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `LoginScreen`                  | `/login`                                                                                | `POST /api/login`                                                               |
| `DashboardScreen` (role-aware) | `/super-admin/dashboard`, `/coach/dashboard`, `/manager/dashboard`, `/player/dashboard` | `GET /api/dashboard`                                                            |
| `TeamsListScreen`              | `/coach/teams`, `/super-admin/teams`                                                    | `GET /api/teams`                                                                |
| `PlayersListScreen`            | `/coach/players`                                                                        | `GET /api/players`                                                              |
| `PlayerDetailScreen`           | `/coach/players/{id}`                                                                   | `GET /api/players/{id}` + ölçümler/yaralanmalar                                 |
| `MatchesListScreen`            | `/coach/matches`                                                                        | `GET /api/matches`                                                              |
| `MatchDetailScreen`            | `/coach/matches/{id}`                                                                   | `GET /api/matches/{id}` + `/stats`                                              |
| `LineupBuilderScreen`          | `/coach/lineups/create`                                                                 | `GET /api/lineups/options`, `GET /api/matches/{id}/roster`, `POST /api/lineups` |
| `LineupDetailScreen`           | `/coach/lineups/{id}`                                                                   | `GET /api/lineups/{id}` + status polling `/api/lineups/{id}/status`             |
| `SmartLineupScreen`            | `/coach/smart-squad`                                                                    | `POST /api/smart-squad` (async:true) + status polling                           |
| `AnalysisListScreen`           | `/coach/analysis`                                                                       | `GET /api/analysis`                                                             |
| `AnalysisDetailScreen`         | `/coach/analysis/{id}`                                                                  | `GET /api/analysis/{id}` + status polling                                       |
| `LeagueFixtureScreen`          | `/super-admin/leagues/{id}`                                                             | `GET /api/leagues/{id}`                                                         |
| `MyMatchesScreen` (player)     | `/player/matches`                                                                       | `GET /api/my/matches`                                                           |
| `MyTrainingsScreen` (player)   | `/player/trainings`                                                                     | `GET /api/my/trainings`                                                         |
| `MyHealthScreen` (player)      | `/player/health`                                                                        | `GET /api/my/health`                                                            |

## Navigasyon İskeleti

```ts
// App.tsx
<NavigationContainer>
  {isAuthenticated ? (
    <BottomTab.Navigator>
      {user.role === 'coach' && (
        <>
          <Tab.Screen name="Dashboard" component={CoachDashboard} />
          <Tab.Screen name="Kadrolar" component={LineupsListScreen} />
          <Tab.Screen name="AI" component={AnalysisListScreen} />
          <Tab.Screen name="Maçlar" component={MatchesListScreen} />
        </>
      )}
      {user.role === 'player' && (
        <>
          <Tab.Screen name="Özet" component={PlayerDashboard} />
          <Tab.Screen name="Maçlarım" component={MyMatchesScreen} />
          <Tab.Screen name="Antrenmanlarım" component={MyTrainingsScreen} />
          <Tab.Screen name="Sağlık" component={MyHealthScreen} />
        </>
      )}
      {/* super_admin / manager benzer şekilde */}
    </BottomTab.Navigator>
  ) : (
    <Stack.Navigator><Stack.Screen name="Login" component={LoginScreen} /></Stack.Navigator>
  )}
</NavigationContainer>
```

## Lineup Saha Görünümü (Top-Down)

Web tarafıyla birebir aynı koordinat sistemi (`field_x`, `field_y` yüzde). Dikey, kale üstte forvet altta.

```tsx
// components/LineupField.tsx
import Svg, { Rect, Circle, Line } from "react-native-svg";

export function LineupField({ players }: { players: Player[] }) {
  return (
    <View className="bg-emerald-900 rounded-xl p-4 aspect-[3/4]">
      <Svg width="100%" height="100%" viewBox="0 0 100 130">
        <Rect
          x={2}
          y={2}
          width={96}
          height={126}
          fill="none"
          stroke="white"
          strokeOpacity={0.2}
        />
        <Line
          x1={2}
          y1={65}
          x2={98}
          y2={65}
          stroke="white"
          strokeOpacity={0.2}
        />{" "}
        {/* orta çizgi yatay */}
        <Circle
          cx={50}
          cy={65}
          r={10}
          fill="none"
          stroke="white"
          strokeOpacity={0.2}
        />
        {/* üst/alt kale alanları */}
        <Rect
          x={35}
          y={2}
          width={30}
          height={10}
          fill="none"
          stroke="white"
          strokeOpacity={0.2}
        />
        <Rect
          x={35}
          y={118}
          width={30}
          height={10}
          fill="none"
          stroke="white"
          strokeOpacity={0.2}
        />
      </Svg>
      {players.map((p) => (
        <View
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.field_x}%`,
            top: `${p.field_y * 0.95}%`,
            transform: [{ translateX: -40 }, { translateY: -20 }],
          }}
        >
          <PlayerCard
            slot={p.slot_key}
            jersey={p.player.jersey_number}
            name={p.player.last_name}
          />
        </View>
      ))}
    </View>
  );
}
```

## AI / Asenkron İşler — Polling Pattern

React Query `refetchInterval` ile durum endpoint'ini soratabilirsin:

```ts
const { data } = useQuery({
  queryKey: ["lineup-status", lineupId],
  queryFn: () =>
    api.get(`/lineups/${lineupId}/status`).then((r) => r.data.data),
  refetchInterval: (q) =>
    ["completed", "failed"].includes(q.state.data?.status) ? false : 3000,
});
```

`data.status_label` ("Sıraya alındı / İşleniyor / Hazır / Başarısız") — backend zaten Türkçe etiket döndürüyor; UI'da olduğu gibi göster.

## Stil Tutarlılığı

Web'de Tailwind sınıfları (`bg-emerald-900/70`, `text-accent`, `rounded-xl`) NativeWind ile aynı çalışır:

```ts
// tailwind.config.js — web ile aynı renkleri kopyala
module.exports = {
  content: ["./App.tsx", "./screens/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        accent: "#22c55e",
        "accent-hover": "#16a34a",
        surface: { 700: "#1a1a1a", 800: "#111111" },
      },
    },
  },
};
```

## Yapılması Gerekenler Listesi

1. `LoginScreen` + token saklama
2. Role-based root navigator (super_admin / manager / coach / player)
3. Her rol için bottom tab grubu (yukarıdaki tablo)
4. `LineupField` SVG component (top-down, kart pozisyonlama)
5. AI status polling hook (`useJobStatus`)
6. Markdown renderer wrapper (`react-native-markdown-display`)
7. Push notification (opsiyonel — analiz/kadro hazır olunca)
8. EAS Build ile iOS/Android distribusyonu

## Yayınlama

```bash
eas build --platform all
eas submit --platform ios   # App Store
eas submit --platform android  # Google Play
```

Detay: [Expo EAS docs](https://docs.expo.dev/eas/).
