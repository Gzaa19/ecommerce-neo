# Data Model: WattUp!

Sumber: [spec.md](spec.md). Semua data lokal, bukan tabel database. Tidak ada entitas akun, keranjang, pesanan tersimpan, atau pembayaran.

## Store

| Field | Bentuk | Aturan |
| --- | --- | --- |
| name | string | Tepat `WattUp!`; tampil termasuk tanda seru |
| logo | string | `/brand/wattup-logo.png`; sumber asli tidak dimodifikasi |
| description | string | Profil singkat nonkosong, tanpa klaim usaha rekaan |
| whatsapp | string | Default `""`; hanya digit internasional 8-15 digit, digit pertama 1-9; nomor Indonesia memakai `62` |
| address | string atau null | Null menampilkan `Alamat belum tersedia` |
| openingHours | string atau null | Null menampilkan `Jam buka belum tersedia` |
| isDemo | boolean | True selama produk/harga masih contoh; tampilkan pemberitahuan jelas |

Batas bawah 8 digit adalah kebijakan defensif aplikasi, bukan bukti nomor terdaftar. Nomor salah format tidak menggagalkan website: seluruh CTA WhatsApp dinonaktifkan, nomor mentah tidak dijadikan tautan.

## Category

| Field | Bentuk | Aturan |
| --- | --- | --- |
| id | string | Unik, stabil, tidak kosong |
| name | string | Unik, tidak kosong |

Data awal: `rumah` / Peralatan Rumah; `audio` / Audio; `aksesori` / Aksesori Elektronik. `all` hanya nilai UI untuk Semua, bukan kategori data.

## Product

| Field | Bentuk | Aturan |
| --- | --- | --- |
| code | string | Unik, tidak kosong; dipakai sebagai React key dan identitas pesan |
| name | string | Tidak kosong; pencarian memakai nama ini |
| categoryId | string | Harus merujuk kategori yang ada |
| price | number | Bilangan bulat aman dan positif, unit Rupiah tanpa pecahan |
| image | string atau null | Path foto lokal di `/products/`; null memakai fallback |
| imageAlt | string | Deskripsi barang nonkosong |
| description | string | Deskripsi singkat nonkosong |
| specs | pasangan label/value[] | 3-5 pasangan dengan label/value tidak kosong |
| availability | `available` atau `sold_out` | Ditampilkan Tersedia atau Habis |

Data awal 8 barang sesuai spec. Satu barang minimal habis. Harga/spec contoh harus diberi label demo. Jumlah kartu berasal dari data, bukan angka hardcode.

## Validation boundary

`lib/store.ts` mengekspor data toko, kategori, dan produk. `lib/catalog.ts` mengekspor fungsi murni validasi, filter, format harga, dan pembuatan tautan. `app/page.tsx` memvalidasi data sebelum render statis; kategori/produk invalid atau kode duplikat membuat build gagal dengan pesan field/kode bermasalah. Tidak diam-diam mengganti harga atau menghapus barang invalid. Nomor toko invalid memakai perilaku CTA nonaktif, bukan build gagal.

## State sementara di browser

- `query`: string, awal kosong; trim dan pencarian case-insensitive memakai pencocokan substring literal.
- `categoryId`: `all` atau id kategori; awal `all`. Kondisi query dan kategori digabung dengan AND, urutan data dipertahankan.
- Hasil filter dihitung dari dua nilai tersebut; tidak disimpan sebagai state tambahan.
- Rincian terbuka memakai state native `<details>`, bukan state global.
- Kegagalan foto memakai state lokal komponen foto. Ukuran area tetap.
- Draf pesan dihitung dari toko dan satu produk; jumlah selalu 1. URL tidak dibuat untuk barang habis atau kontak invalid.
- Reset mengosongkan query dan memilih `all`. Tidak ada penyimpanan browser, cookie aplikasi, atau transisi transaksi setelah kembali dari WhatsApp.
