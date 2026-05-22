# PlayerPulse API Referansı

PlayerPulse REST API'si Laravel Sanctum token tabanlı kimlik doğrulama kullanır. Tüm cevaplar tek bir zarf içinde döner.

- **Base URL:** `/api`
- **Auth:** `Authorization: Bearer {token}` (login response'undan alınır)
- **Content-Type:** `application/json` (multipart yalnızca dosya yüklemede)

## Cevap Zarfı

Başarılı:
```json
{ "success": true, "message": "...", "data": { } }
```

Hata:
```json
{ "success": false, "message": "...", "errors": { } }
```

`errors` alanı yalnızca 422 validation cevaplarında bulunur.

## HTTP Kodları
- `200` OK — başarılı GET/PUT
- `201` Created — yeni kayıt
- `202` Accepted — kuyruğa alındı (asenkron iş)
- `400` Bad Request — domain hatası (örn. AI sağlayıcısı yapılandırılmamış)
- `401` Unauthorized — token yok / geçersiz
- `403` Forbidden — rol yetersiz
- `404` Not Found
- `422` Unprocessable Entity — validation
- `500` Internal Server Error

## İçindekiler
1. [Auth](#1-auth)
2. [Dashboard](#2-dashboard)
3. [Teams](#3-teams)
4. [Users](#4-users)
5. [Leagues](#5-leagues)
6. [Fixture Imports](#6-fixture-imports)
7. [Players](#7-players)
8. [Trainings & Performances](#8-trainings--performances)
9. [Matches & Stats](#9-matches--stats)
10. [Lineups](#10-lineups)
11. [Smart Lineup (AI)](#11-smart-lineup-ai)
12. [AI Analysis](#12-ai-analysis)
13. [Development Reports](#13-development-reports)
14. [Injuries](#14-injuries)
15. [Physical Measurements](#15-physical-measurements)
16. [Player Notes](#16-player-notes)
17. [Player Self-Service (My)](#17-player-self-service-my)
18. [Bulk Jobs](#18-bulk-jobs)

---

## 1. Auth

### POST /api/register
- **Auth:** Guest
- **Body:** `{ name, surname, email, password, password_confirmation }`
- **Response 201:** `{ data: { user, token } }`
- **Arayüz karşılığı:** —
- **Notlar:** Yalnızca `player` rolü oluşturulur. `role` alanı reddedilir.

### POST /api/login
- **Auth:** Guest
- **Body:** `{ email, password }`
- **Response 200:** `{ data: { user, token } }`
- **Arayüz karşılığı:** `/login` formu.

### GET /api/me
- **Auth:** Sanctum
- **Response 200:** `{ data: User }`

### POST /api/logout
- **Auth:** Sanctum
- **Response 200:** `{ success: true }`
- **Arayüz karşılığı:** Üst menü "Çıkış".

## 2. Dashboard

### GET /api/dashboard
- **Auth:** Sanctum
- **Response 200:** Role'e göre KPI özetleri.
- **Arayüz karşılığı:** `/super-admin/dashboard`, `/coach/dashboard`, `/manager/dashboard`, `/player/dashboard`.

## 3. Teams

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/teams` | super_admin, manager, coach | `/super-admin/teams`, `/coach/teams` |
| GET | `/api/teams/{team}` | super_admin, atanmış manager/coach | `/coach/teams/{id}` |
| POST | `/api/teams` | super_admin | `/super-admin/teams/create` |
| PUT/PATCH | `/api/teams/{team}` | super_admin, manager (atanmış) | "Düzenle" |
| DELETE | `/api/teams/{team}` | super_admin | "Sil" |
| POST | `/api/teams/{team}/coaches` | super_admin | "Personel Ata" |
| DELETE | `/api/teams/{team}/coaches/{user}` | super_admin | "Personel Çıkar" |
| POST | `/api/teams/{team}/staff` | super_admin | aynı (`coaches` ile aynı service) |
| DELETE | `/api/teams/{team}/staff/{user}` | super_admin | aynı |

`staff` rotaları web tarafıyla aynı isimlendirmeyi sunan alias'lardır; `coaches` rotaları geriye dönük uyumluluk için tutulur.

### POST /api/teams (örnek body)
```json
{ "name": "Galatasaray U19", "age_category": "U19", "season": "2025-2026", "description": null }
```

## 4. Users

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/users` | super_admin | `/super-admin/users` |
| POST | `/api/users` | super_admin | `+ Yeni Kullanıcı` |
| GET | `/api/users/{user}` | super_admin | satır "Görüntüle" |
| PUT/PATCH | `/api/users/{user}` | super_admin | "Düzenle" |
| DELETE | `/api/users/{user}` | super_admin | "Sil" |

## 5. Leagues

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/leagues` | super_admin, manager, coach | `/super-admin/leagues` |
| GET | `/api/leagues/{league}` | super_admin, manager, coach | `/super-admin/leagues/{id}` |
| POST | `/api/leagues` | super_admin | `/super-admin/leagues/create` |
| PUT/PATCH | `/api/leagues/{league}` | super_admin | "Düzenle" |
| DELETE | `/api/leagues/{league}` | super_admin | "Sil" |

### POST /api/leagues (örnek body)
```json
{
  "name": "Süper Lig",
  "season": "2025-2026",
  "description": "Resmi fikstür",
  "team_ids": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
}
```

## 6. Fixture Imports

### POST /api/leagues/{league}/fixtures/import
- **Auth:** super_admin
- **Body (dosya):** multipart/form-data, `fixture_file` (csv/xls/xlsx, max 5MB)
- **Body (manuel):** `{ rows: [{ week, date, home_team, away_team, location?, status? }] }`
- **Response (dosya) 202:** `{ data: { fixture_import_id, status: "queued", status_url } }`
- **Response (manuel) 201:** `{ data: { fixture_import_id, status: "completed", created_rows, skipped_rows, skipped } }`
- **Arayüz karşılığı:** `/super-admin/leagues/{id}` — "Dosyadan Yükle" veya "Manuel Satır Ekle" formu.
- **Notlar:** Dosya yükleme **kuyruğa** alınır. Manuel satırlar senkrondur. `status` kolonu kabul edilen değerler: `scheduled, first_half, half_time, second_half, finished, postponed`.

### GET /api/fixture-imports/{import}
- **Auth:** super_admin
- **Response 200:** `{ data: { id, status, status_label, created_rows, skipped_rows, skipped, error_message } }`
- **Arayüz karşılığı:** `/super-admin/leagues/{id}` — "Son İçe Aktarımlar" tablosundaki status rozet (otomatik polling).

## 7. Players

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/players` | super_admin, manager, coach | `/super-admin/players` |
| POST | `/api/players` | super_admin, manager, coach | "+ Yeni Oyuncu" |
| GET | `/api/players/{player}` | super_admin, manager, coach (takım sınırı) | "Görüntüle" |
| PUT/PATCH | `/api/players/{player}` | aynı | "Düzenle" |
| DELETE | `/api/players/{player}` | aynı | "Sil" |
| POST | `/api/players/{player}/create-account` | super_admin, manager | "Oyuncu Hesabı Oluştur" |

## 8. Trainings & Performances

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/trainings` | super_admin, manager, coach | `/coach/trainings` |
| POST | `/api/trainings` | super_admin, coach | "+ Yeni Antrenman" |
| GET | `/api/trainings/{training}` | super_admin, manager, coach | "Görüntüle" |
| PUT/PATCH | `/api/trainings/{training}` | super_admin, coach | "Düzenle" |
| DELETE | `/api/trainings/{training}` | super_admin, coach | "Sil" |
| GET | `/api/trainings/{training}/performances` | super_admin, manager, coach | "Performansları" |
| POST | `/api/trainings/{training}/performances` | super_admin, coach | tekil kaydet |
| POST | `/api/trainings/{training}/performances/bulk` | super_admin, coach | "Toplu Kaydet" |

`POST .../performances/bulk` request'inde `async=true` ve `players` 30'dan fazla ise kuyruğa alınır (202).

## 9. Matches & Stats

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/matches` | super_admin, manager, coach | `/coach/matches` |
| POST | `/api/matches` | super_admin, coach | "+ Yeni Maç" |
| GET | `/api/matches/{match}` | super_admin, manager, coach | "Görüntüle" |
| PUT/PATCH | `/api/matches/{match}` | super_admin, coach | "Düzenle" |
| DELETE | `/api/matches/{match}` | super_admin, coach | "Sil" |
| GET | `/api/matches/{match}/stats` | super_admin, manager, coach | "İstatistikler" |
| POST | `/api/matches/{match}/stats` | super_admin, coach | tekil kaydet |
| POST | `/api/matches/{match}/stats/bulk` | super_admin, coach | "Toplu Kaydet" |
| GET | `/api/matches/{match}/roster` | super_admin, coach | "Kadro" |

`POST .../stats/bulk` aynı şekilde 30+ ve `async=true` ile kuyruğa alınır.

## 10. Lineups

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/lineups` | super_admin, coach | `/coach/lineups` |
| GET | `/api/lineups/options` | super_admin, coach | yeni kadro formu seçenekleri |
| GET | `/api/lineups/{lineup}` | super_admin, coach | "Görüntüle" |
| POST | `/api/lineups` | super_admin, coach | "Kadroyu Kaydet" |
| DELETE | `/api/lineups/{lineup}` | super_admin, coach | "Sil" |
| GET | `/api/lineups/{lineup}/status` | super_admin, coach | AI kadro polling |

### POST /api/lineups (body)
```json
{
  "match_id": 1,
  "formation": "4-4-2",
  "note": "Sakat oyuncular hariç",
  "players": [
    { "player_id": 5, "position_id": 1, "slot_key": "GK", "field_x": 50, "field_y": 12, "is_starting": true }
    /* 11 oyuncu */
  ]
}
```

## 11. Smart Lineup (AI)

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/smart-squad/options` | super_admin, coach | `/coach/smart-squad` |
| POST | `/api/smart-squad` | super_admin, coach | "AI Önerisi Al" |

### POST /api/smart-squad (body)
```json
{ "match_id": 1, "formation": "4-3-3", "note": "...", "async": true }
```

- `async=false` (default): sync, 201 + `data` lineup.
- `async=true`: 202 + `{ data: { id, status: "queued", status_url } }`. `/api/lineups/{id}/status` ile durum sorgulanır.

## 12. AI Analysis

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/analysis/options` | super_admin, manager, coach | `/coach/analysis/create` |
| GET | `/api/analysis` | super_admin, manager, coach | `/coach/analysis` |
| GET | `/api/analysis/{analysis}` | super_admin, manager, coach | "Görüntüle" |
| GET | `/api/analysis/{analysis}/status` | super_admin, manager, coach | analiz polling |
| POST | `/api/analysis` | super_admin, coach | "Analizi Başlat" |
| DELETE | `/api/analysis/{analysis}` | super_admin, coach | "Sil" |

`POST /api/analysis` aynı şekilde `async=true` ile kuyruğa alınır.

## 13. Development Reports

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/development-reports` | super_admin, manager, coach | `/coach/evaluations` |
| GET | `/api/development-reports/{report}` | aynı | "Görüntüle" |
| POST | `/api/players/{player}/reports` | super_admin, manager, coach | "+ Rapor" |
| DELETE | `/api/development-reports/{report}` | aynı | "Sil" |

> Web tarafında bu modül **Evaluations** olarak isimlendirilir; aynı tabloyu kullanır.

## 14. Injuries

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/injuries` | super_admin, manager, coach | `/coach/players/{id}` Sağlık sekmesi |
| POST | `/api/players/{player}/injuries` | aynı | "+ Sakatlık" |
| PUT | `/api/injuries/{injury}` | aynı | "Düzenle" |
| DELETE | `/api/injuries/{injury}` | aynı | "Sil" |

## 15. Physical Measurements

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/physical-measurements` | super_admin, manager, coach | Oyuncu detayı |
| POST | `/api/players/{player}/measurements` | aynı | "+ Ölçüm" |
| PUT | `/api/physical-measurements/{measurement}` | aynı | "Düzenle" |
| DELETE | `/api/physical-measurements/{measurement}` | aynı | "Sil" |

## 16. Player Notes

| Method | URI | Roles | Arayüz |
|---|---|---|---|
| GET | `/api/players/{player}/notes` | super_admin, manager, coach | Oyuncu detayı "Notlar" |
| POST | `/api/players/{player}/notes` | aynı | "+ Not" |
| DELETE | `/api/notes/{note}` | aynı | "Sil" |

## 17. Player Self-Service (My)

Yalnızca `player` rolü ile erişilir. Tüm rotalar `Authorization: Bearer {token}` ile çalışır.

| Method | URI | Arayüz |
|---|---|---|
| GET | `/api/my/health` | `/player/health` |
| GET | `/api/my/matches` | `/player/matches` |
| GET | `/api/my/trainings` | `/player/trainings` |
| GET | `/api/my/reports` | `/player/reports` |

`/api/my/matches` ve `/api/my/trainings` cevapları `summary` ve sayfalanmış `stats`/`performances` döner. Sorgu parametreleri: `date_from`, `date_to`, `attendance_status`, `match_type`, `per_page`.

## 18. Bulk Jobs

### GET /api/jobs/{uuid}/status
- **Auth:** Sanctum
- **Response 200:** `{ data: { status, processed, total, error_message? } }`
- **Arayüz karşılığı:** "Toplu Kaydet" sonrası ilerleme paneli.
- **Notlar:** Cache TTL 1 saat. Süre dolarsa 404 döner.

---

## Status Sözlüğü

| Durum | Anlamı | UI Etiketi |
|---|---|---|
| `queued` | İş kuyruğa alındı | Sıraya alındı |
| `running` | İşleniyor | İşleniyor |
| `completed` | Başarıyla tamamlandı | Hazır / Tamamlandı |
| `failed` | Hata aldı | Başarısız |
| `scheduled` (match) | Maç henüz oynanmadı | Programlandı |
| `first_half` / `second_half` | Maç oynanıyor | İlk yarı / İkinci yarı |
| `half_time` | Devre arası | Devre arası |
| `finished` | Maç tamamlandı | Tamamlandı |
| `postponed` | Maç ertelendi | Ertelendi |

## Notlar

- Tüm tarih alanları `YYYY-MM-DD` (date) veya `YYYY-MM-DD HH:MM:SS` (datetime) biçimindedir.
- Sayfalama: Laravel'in default paginator çıktısı (`data`, `meta`, `links`).
- API'de form validation hataları HTTP 422 + `errors` objesi olarak döner.
- Asenkron iş gerektiren tüm istekler **queue worker** çalışıyor olmasını gerektirir: `php artisan queue:work`.
