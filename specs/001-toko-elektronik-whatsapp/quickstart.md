# Quickstart dan hasil validasi WattUp!

## Status

Demo lokal tersedia. Katalog satu toko, tanpa login, backend, database, cart atau pembayaran online. Kontak pemilik `6282325185544`, jam buka `08.00–22.00`, dan isDemo=true. Tombol WhatsApp aktif; produk tetap contoh. Belum dirilis publik. Bukan bukti seluruh acceptance criterion selesai: uji pembaca layar nyata, performa LCP, peserta siswa, konten final dan deployment masih terbuka.

## Runtime dan perintah

Node.js v24.11.0 project-local; npm 11.6.1 (runtime Node 24; npm global awal berbeda). Tidak mengubah Node global. Gunakan `nvm use` bila nvm tersedia, atau prepend direktori Node 24 ke PATH.

```bash
cd /Users/gzaaa19/elpaso-elektronik
nvm use
npm ci
npm run dev
```

Pemeriksaan produksi, lalu preview:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
python3 -m http.server 3000 --bind 127.0.0.1 --directory out
```

Preview: http://127.0.0.1:3000. Port lain boleh jika sibuk. `out/` adalah hasil static export; jangan memakai `next start`. Build tidak menjalankan lint, karena itu lint dijalankan terpisah.

Versi terpasang: Next.js/eslint-config-next 16.4.5; react/react-dom 19.3.1; TypeScript 6.0.3; ESLint 9.39.5; @types/node 24.19.2; @types/react/@types/react-dom 19.3.0. TypeScript 6 dipilih karena parser lint belum mendukung 7. ESLint 9 deprecated di registry, tetapi plugin Next yang terpasang belum kompatibel dengan 10.

## Redesign referensi Stitch — 2026-11-07

Palet kuning elektrik–cyan–magenta, border hitam, hard shadow, dan font lokal Space Grotesk / Work Sans / Space Mono dengan lisensi OFL. Nama serta logo tetap WattUp!. Delapan halaman `/produk/{code}/` diekspor statis; foto besar, harga, deskripsi, spesifikasi, draf WhatsApp, FAQ native, dan produk terkait. Tidak menambah login, cart, varian/galeri palsu, ulasan, promo rekaan, atau pengumpulan data pembeli.

Verifikasi ulang: 11/11 unit test PASS, lint/typecheck/build PASS; beranda dan delapan detail diuji pada 360/768/1440 × light/dark. Filter/reset, draft sesuai unit test, FAQ, tidak ada overflow atau page errors, request hanya origin lokal. Axe 0 pelanggaran pada beranda dan halaman detail sampel dalam setiap kombinasi. Laporan: `/Users/gzaaa19/.hermes/cache/scratch/wattup-qa/redesign-results.json`; script `redesign.mjs` di folder sama. Target LCP belum diukur ulang setelah redesign; angka Lighthouse di bawah bersifat historis.

## Hasil sebelum redesign — 2026-11-07

- RED: test gagal ERR_MODULE_NOT_FOUND sebelum lib/store.ts/lib/catalog.ts dibuat.
- GREEN akhir: npm run test 10/10 PASS; npm run lint PASS (zero warnings); npm run typecheck PASS; npm run build PASS. Static route `/`, not-found, icon tersedia.
- Logo sumber SHA-256 tetap `2238d348c1d6b6f474304ab5c8cfc8830618a4d234920be33473dc299ee3bfd0`. Header/footer memakai turunan 112×112 lossless WebP, tidak crop/recolor; favicon turunan 128×128 PNG.
- Delapan WebP produk terdecode, total 155070 bytes, maksimum sisi 640px. Atribusi/lisensi tersedia di footer dan public/products/SOURCES.md.
- `npm audit --omit=dev`: 0 vulnerabilities. Audit lengkap: 8 moderate dalam rantai dev-toolchain minimatch, GHSA-g3hv-75wg-m249. `npm audit fix` tanpa force belum menyelesaikan; tidak melakukan downgrade major Next atau override major dependency sembarangan. Audit ini bukan bukti aplikasi bebas seluruh masalah keamanan.

## Browser dan skenario penerimaan sebelum redesign (historis)

Chromium 158 headless via Playwright eksternal di cache scratch; tidak menambah dependency aplikasi. Target static export melalui server Python localhost. Fixtures hanya dipasang sementara saat build lokal, lalu lib/store.ts dan out/ dibangun kembali dengan kontak kosong. Tidak membuka wa.me atau mengirim pesan. Semua skenario dengan nomor valid menginspeksi href dan decoded text saja, bukan membuktikan akun aktif.

| Skenario | Hasil aktual |
|---|---|
| S1 | PASS: title/lang, brand/logo, hero, menu, CTA tanpa login. |
| S2 | PASS: empat anchor menu benar; link Lihat Produk menuju #produk; satu halaman. |
| S3 | PASS: 8 kartu, kategori, harga, status, detail, CTA; 3 kategori. |
| S4 | PASS: disclosure buka/tutup klik dan keyboard, 3 spesifikasi tiap produk. |
| S5 | PASS: urutan data tetap; reset mengembalikan 8 kartu. |
| S6 | PASS: query `  SPEAKER  `, kategori audio/rumah, filter gabungan. |
| S7 | PASS: zero matches, Reset Filter membersihkan query/kategori. |
| S8 | PASS fixture: 7 href purchase ke fixed host/receiver; cocok nama/kode/jumlah 1/harga; tidak diikuti. |
| S9 | PASS fixture: 1 barang habis tetap disabled; kontak umum aktif. |
| S10 | PASS kosong/invalid: 9 CTA disabled, 0 href WhatsApp, alasan terlihat. |
| S11 | PASS inspeksi konten: cara beli, pembeli mengirim sendiri, konfirmasi dan pembayaran di chat; bukan status transaksi. |
| S12 | PASS anchor dan inspeksi konten: profil, alamat/jam belum tersedia. |
| S13 | PASS fixture: image null dan request gambar 404 menampilkan fallback; ruang tetap. Request 404 disengaja hanya pada fixture, bukan demo akhir. |
| S14 | PASS fixture: products=[] menampilkan Produk belum tersedia, 0 kartu/hasil. |
| S15 | PASS otomatis: 360/768/1440px × light/dark, scrollWidth=viewport, grid 1/2/3, gambar berhasil setelah lazy-load discroll. |
| S16 | PARTIAL: Tab/Shift+Tab, skip link, Enter/Space disclosure, fokus solid, label dan status aria-live polite diperiksa; pengumuman suara pembaca layar belum diuji langsung. |
| S17 | PASS fixture: draf kontak umum tepat, tanpa nama produk. |
| S18 | PASS fixture: nama sangat panjang, & + # ? Unicode/newline; penerima tetap, tanpa overflow 360px; round-trip juga diuji unit. |
| S19 | PASS fixture: request foto ditahan sementara; teks tetap dapat dibaca, dimensi area foto sebelum/sesudah sama. |
| S20 | PASS otomatis: seluruh 6 kombinasi tema/lebar; media reduced-motion tersedia, tidak ada animasi berulang. |

Axe WCAG2/2.1 A/AA pada 6 kombinasi: 0 pelanggaran terdeteksi. Target kontrol utama >=44×44; dua menu ponsel semula terlalu sempit dan sudah diperbaiki. Struktur label/alt/lang/headings tersedia. Audit otomatis tidak menggantikan pemeriksaan pembaca layar manusia. Console/page errors akhir 0; request non-local 0; localStorage/sessionStorage 0, cookies aplikasi kosong. Tidak ada state pesanan/pembayaran palsu.

Artefak sesi (cache scratch, bukan prasyarat aplikasi):

- `/Users/gzaaa19/.hermes/cache/scratch/wattup-qa/check.mjs`, `fixtures.mjs`, `browser-results.json`.
- `/Users/gzaaa19/.hermes/cache/scratch/wattup-desktop.png`, `wattup-mobile.png`.
- `/Users/gzaaa19/.hermes/cache/scratch/wattup-qa/lighthouse-final.report.html` dan `.json`.

## Performa sebelum redesign — historis, bukan hasil tampilan baru

Lighthouse mobile, viewport 412×823 DPR1.75, simulasi throttling 4G: RTT150ms, throughput1638.4Kbps, CPU4×; localhost Python HTTP/1.0 tanpa kompresi HTTP. Bukan hasil hosting HTTPS produksi.

| Metrik | Sebelum optimasi | Akhir |
|---|---:|---:|
| Performance | 79 | 84 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 0.903 s | 0.903 s |
| LCP | 5.644 s | 4.578 s |
| Speed Index | 0.949 s | 0.903 s |
| CLS | 0 | 0 |
| Total Blocking Time | 20.5 ms | 12.5 ms |

Perbaikan: logo display dari 1.39MB ke 13.5KB tanpa mengubah sumber; foto produk diperkecil; hero preload/fetchPriority high. FCP dan CLS memenuhi target masing-masing; **LCP belum memenuhi <2.5s dan konten visual terbesar masih >3s**. SC-007 belum dinyatakan lulus penuh. Ulangi audit setelah hosting berkompresi HTTP/Brotli dan cache tersedia; jangan memakai skor contoh sebagai pengganti. INP lapangan belum tersedia; TBT bukan INP.

## Pengeditan dan rilis

Edit lib/store.ts untuk profil, kontak, kategori dan 8 produk; helper lib/catalog.ts memvalidasi data saat build. Nomor harus digit internasional 8–15, awal 1–9; Indonesia awalan 62, tanpa +/spasi. Jangan normalisasi otomatis 08. Format valid tidak membuktikan akun aktif/kepemilikan. Ganti aset di public/products/ dengan foto sesuai dan berizin, perbarui SOURCES.md/kredit footer. Bila mengganti logo, regenerasi turunannya untuk header/favicon, jangan crop/distorsi.

Pending:

- T018: pengumuman pembaca layar nyata belum diverifikasi; pemeriksaan otomatis/keyboard selesai.
- T021 / SC-003: 3 siswa belum tersedia; tidak ada durasi rekaan.
- T022: nomor/profil/harga/spec/stock/foto final dan persetujuan pemilik belum ada; isDemo tetap true.
- T023 / SC-008: belum ada izin/hosting/URL publik; tidak deploy diam-diam.
- SC-007: LCP lab belum mencapai target, perlu tindak lanjut pada hosting produksi.

Extension pre/post hooks: `.specify/extensions.yml` tidak ada saat pemeriksaan; tidak ada hook untuk didispatch. Checklist requirements.md hanya dibaca sebagai gate kualitas spec, tidak diubah.
