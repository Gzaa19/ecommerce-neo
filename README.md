# WattUp!

Katalog satu toko elektronik untuk tugas kewirausahaan. Next.js App Router + TypeScript + native CSS, neobrutalism kuning elektrik–cyan–magenta, tema mengikuti perangkat. Pencarian, kategori, halaman detail produk statis, harga Rupiah, status barang dan draf pembelian WhatsApp. Tanpa akun, database, backend bisnis, cart atau pembayaran online.

## Jalankan

Node.js 24 LTS, npm. Dari direktori proyek:

```bash
nvm use
npm ci
npm run dev
```

Jika tidak memakai nvm, gunakan instalasi Node 24 yang tersedia. Preview produksi:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
python3 -m http.server 3000 --bind 127.0.0.1 --directory out
```

Buka http://127.0.0.1:3000. Deploy nantinya memakai isi `out/` ke static hosting; bukan `next start`. Tidak perlu runtime Next.js pada hosting.

## Edit konten

- `lib/store.ts`: nama/profil/kontak, alamat/jam buka, kategori dan produk. Kode produk unik, harga integer positif, 3–5 specs, availability `available` atau `sold_out`. Data invalid membuat build gagal dengan nama field.
- Isi `store.whatsapp` dengan nomor milik toko berformat internasional, digit saja, 8–15 digit, awal 1–9; nomor Indonesia diawali `62`, tanpa `+`, spasi atau awalan lokal `0`. Validasi format bukan bukti nomor aktif atau kepemilikan; pemilik harus memastikan penerima sendiri.
- Kontak toko: `6282325185544` (+62 823-2518-5544); jam buka `08.00–22.00`, sesuai data pemilik. Tombol WhatsApp aktif; produk habis tetap tidak dapat dibeli. Jika nomor dikosongkan/invalid, CTA nonaktif. Pesan tidak dikirim otomatis.
- `public/products/`: ganti dengan foto sesuai produk, berizin. Pertahankan/perbarui `SOURCES.md` dan kredit footer di `components/Shell.tsx`. Foto saat ini ilustrasi kategori dari Wikimedia Commons, bukan stok toko.
- `public/brand/wattup-logo.png`: logo asli tidak dimodifikasi. Tampilan memakai turunan `wattup-logo-small.webp`; favicon `app/icon.png`. Regenerasi keduanya bila logo diganti, tanpa crop/distorsi/recolor.
- `store.isDemo=true` selama harga/foto/spec/status masih contoh. Jangan ubah ke false sebelum data final disetujui pemilik. Perubahan data memerlukan build/deploy ulang.

## Status terverifikasi

- Demo lokal selesai; 8 barang / 3 kategori. Belum menerima pembelian nyata, belum dirilis publik.
- 11/11 unit test PASS; lint, strict typecheck, static build PASS.
- Chromium: 360/768/1440px × light/dark, filter/reset, navigasi delapan halaman detail, URL WhatsApp fixture, kontak invalid, empty catalog dan foto fallback diperiksa. Tidak ada pesan dikirim.
- Axe otomatis: 0 pelanggaran terdeteksi pada enam kombinasi. Keyboard diperiksa; pembaca layar nyata belum diuji.
- Lighthouse sebelum redesign (historis, tidak mewakili tampilan baru): performance 84, accessibility 100, best practices 100, SEO 100; FCP 0.903s, LCP 4.578s, CLS 0. LCP belum memenuhi target <2.5s. Hasil localhost HTTP/1.0 tanpa kompresi, bukan hosting produksi.
- Audit production: 0 vulnerabilities. Audit penuh: 8 moderate pada dev-toolchain minimatch; belum ada perbaikan kompatibel lewat audit fix tanpa force. Hindari memproses input glob tidak tepercaya pada toolchain sampai dependency diperbaiki.

Masih pending: uji pembaca layar, target LCP, 3 siswa, data produk final, persetujuan serta hosting deployment. Tidak ada URL publik yang diklaim tersedia.

## Spec Kit

Satu feature seluruh website, satu story; bukan per use case.

- [Spec](specs/001-toko-elektronik-whatsapp/spec.md)
- [Checklist kualitas spec](specs/001-toko-elektronik-whatsapp/checklists/requirements.md)
- [Plan](specs/001-toko-elektronik-whatsapp/plan.md)
- [Research](specs/001-toko-elektronik-whatsapp/research.md)
- [Data model](specs/001-toko-elektronik-whatsapp/data-model.md)
- [Kontrak](specs/001-toko-elektronik-whatsapp/contracts/storefront.md)
- [Tasks/status](specs/001-toko-elektronik-whatsapp/tasks.md)
- [Hasil uji dan batasan lengkap](specs/001-toko-elektronik-whatsapp/quickstart.md)

Constitution bawaan masih template, belum diratifikasi. Tidak ada Git commit atau deployment otomatis.
# ecommerce-neo
