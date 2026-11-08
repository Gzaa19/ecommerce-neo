# Interface Contract: WattUp! Storefront

Rujukan: [spec](../spec.md), [model](../data-model.md). Tidak ada REST API, route handler, server action, atau webhook. Antarmuka eksternal hanya halaman publik, file gambar, dan tautan WhatsApp.

## Public UI

- `GET /`: satu halaman dengan `lang="id"`, title `WattUp! | Toko Elektronik`, deskripsi relevan, ikon situs dari logo.
- Section anchors tetap: `#produk`, `#cara-beli`, `#tentang`, `#kontak`. Tautan logo/nama menuju `#top`.
- Urutan: header, hero, katalog, cara beli, tentang, kontak, footer. Header tidak perlu sticky; menu boleh membungkus rapi di ponsel tanpa hamburger atau JavaScript tambahan.
- Hero: judul singkat rata kiri, teks maksimal 20 kata, `Lihat Produk`, dan satu foto elektronik yang sesuai. Logo tidak menggantikan foto produk hero.
- Katalog: label terlihat `Cari produk`, input pencarian, label `Kategori`, select native dengan pilihan Semua serta kategori data, jumlah hasil `aria-live="polite"`, grid kartu.
- Rincian memakai halaman statis `GET /produk/{code}/`, dibuat dengan `generateStaticParams`; kode tidak dikenal menghasilkan 404. FAQ memakai `<details>` native; navigasi bagian detail memakai anchor, bukan tab JS. Tidak ada modal atau focus trap.
- Pembelian aktif memakai `<a>` tujuan WhatsApp pada tab yang sama. Saat tidak aktif gunakan `<button disabled>` tanpa `href`, plus alasan berupa teks terkait.
- Label tepat: `Beli via WhatsApp`, `Chat Toko`, `Reset Filter`, `Tersedia`, `Habis`, `Produk tidak ditemukan`, `Produk belum tersedia`, `Foto belum tersedia`, `Kontak toko belum tersedia`.
- Katalog kosong: `Produk belum tersedia`. Hasil filter kosong: `Produk tidak ditemukan` plus reset. Satu klik reset mengembalikan semua produk.
- Harga melalui `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`. Spasi locale boleh nonbreaking; nilai harga harus tetap sama di semua tempat.

## WhatsApp handoff

Tujuan persis `https://wa.me/{nomor}?text={pesan_terkode}`. Host dan nomor berasal dari konstanta toko, bukan URL halaman atau input pengunjung. Gunakan `URL` dan `URLSearchParams` untuk satu parameter `text`; jangan interpolasi pesan mentah, jangan encode dua kali.

- Format nomor: `/^[1-9]\d{7,14}$/`. Jangan menebak kode negara, mengubah `08` otomatis, atau menerima URL/karakter tanda tambah sebagai nomor.
- Fungsi pembelian mengembalikan `null` untuk nomor invalid atau status selain `available`.
- Fungsi kontak umum mengembalikan `null` hanya untuk nomor invalid; barang habis tidak mematikan kontak umum.
- Isi teks mengikuti format persis dalam [spec](../spec.md#format-pesan), termasuk newline, nama WattUp!, kode, harga, dan jumlah 1.
- Tidak ada `fetch` ke WhatsApp, token, SDK, atau pengiriman otomatis. Browser hanya mengikuti tautan setelah tindakan pengunjung.
- Uji URL melalui parser: protokol/host tepat, pathname nomor yang diizinkan, hanya parameter `text`, decoded text cocok. Uji karakter `&`, `+`, `#`, `?`, aksara Unicode dan newline.
- Pemeriksaan otomatis tidak mengikuti URL ke nomor telepon dan tidak mengirim pesan. Sebelum rilis pemilik menguji sendiri nomor aktual dan tujuan akun.

## Visual / assets

- Nama merek persis **WattUp!**. Logo asli `/brand/wattup-logo.png`, 1254 x 1254 piksel, SHA-256 `2238d348c1d6b6f474304ab5c8cfc8830618a4d234920be33473dc299ee3bfd0`.
- Logo ditampilkan proporsional dengan `object-fit: contain`; tidak crop, recolor, redraw, atau memasukkan teks ke file. Teks WattUp! diposisikan di luar ikon; `alt=""` bila nama bersebelahan agar tidak dibaca dua kali. Pemakaian logo tanpa teks pendamping memakai `alt="WattUp!"`.
- Turunan favicon boleh resize proporsional tanpa crop, menyimpan sumber asli. Logo besar 1.39 MB bukan alasan menghapus sumber; turunan kecil digunakan untuk ikon situs.
- Palet kuning elektrik–cyan–magenta mengikuti referensi Stitch pengguna; artwork WattUp! asli dipertahankan. Garis tebal dan bayangan keras; CSS sekitar logo solid meskipun shading sudah ada di artwork asli.
- CSS custom properties mengganti tema lewat `prefers-color-scheme`. Font Space Grotesk, Work Sans, dan Space Mono disimpan lokal dengan lisensi OFL; tidak ada permintaan font eksternal saat runtime atau paket ikon. Tidak perlu ikon dekoratif tambahan karena label teks cukup.
- Katalog 1 kolom di bawah 768px, 2 mulai 768px, 3 mulai 1024px. Kontainer maksimum 1280px, padding ponsel 16px. Tombol minimum 44px; CTA tidak terpotong.
- Area foto produk 4:3 tetap; logo 1:1. Foto rusak/kosong mengganti konten gambar, bukan meruntuhkan kontainer. Foto kategori barang nyata/berizin, bukan foto acak; aset demo diberi label dan sumber dicatat di `public/products/SOURCES.md`.
- Fokus terlihat, teks biasa kontras minimal 4.5:1 dalam dua tema. Gerak hanya hover/active singkat, dinonaktifkan pada reduced motion. Tidak ada loading transaksi palsu atau spinner request katalog karena data lokal.

## Build and privacy

Filter tidak membuat permintaan jaringan; navigasi detail membaca halaman statis dari origin yang sama. Website tidak memanggil API bisnis dan tidak mengakses localStorage, cookies, analytics, atau data pribadi pembeli. Static export menyajikan gambar lokal yang disiapkan sebelum build dengan `images.unoptimized: true`; tidak ada Image Optimization API runtime. Kesalahan data wajib menghentikan build; kontak kosong adalah keadaan sah untuk demo. Rilis publik memakai HTTPS, tanpa domain khusus wajib.
