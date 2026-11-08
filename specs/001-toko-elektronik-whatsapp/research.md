# Research: WattUp!

**Date**: 2026-11-07. Planning only; belum menginstal dependensi atau menjalankan build aplikasi.

## Keputusan final

### Next.js dan lingkungan

- **Decision**: Next.js App Router, TypeScript, React, npm; Node.js 24 LTS sebagai baseline konservatif. Node 26 LTS juga didukung sebagai alternatif host, bukan kewajiban upgrade global.
- **Rationale**: Sesuai stack pemesan; minimum resmi Next.js adalah Node 20.9 dan TypeScript 5.1. Node 24 masih LTS; mesin saat planning menjalankan Node v25.2.1/npm 11.7.0, sedangkan lini 25 sudah EOL. Jangan mengubah Node mesin pada tahap planning.
- **Alternatives considered**: Node 25 ditolak untuk baseline produksi karena EOL. Vite atau HTML biasa lebih kecil tetapi tidak memenuhi pilihan Next.js pemesan.
- **Evidence**: [Installation](https://nextjs.org/docs/app/getting-started/installation), [Node releases](https://nodejs.org/en/about/previous-releases).

Metadata npm dibaca langsung kembali oleh parent: `next` 16.4.5, `react` 19.3.1, `typescript` 7.0.2; Next menerima React `^19.0.0`. Ini versi teramati, **bukan kombinasi yang sudah diuji**. Saat implementasi pilih stable yang kompatibel, samakan React/react-dom, pin lockfile, dan jalankan lint/typecheck/test/build. Jika TypeScript 7 belum kompatibel dengan toolchain, pilih stable TypeScript yang didukung Next dan catat alasan; jangan menganggap latest otomatis lolos.

### Static export tanpa runtime backend

- **Decision**: `next.config.ts` menetapkan `output: 'export'` dan `images: { unoptimized: true }`. `next build` menghasilkan `out/`; sajikan file statis.
- **Rationale**: Semua produk lokal dan pembelian pindah ke WhatsApp. Server Components cukup dijalankan saat build. Tidak perlu proses server Next di produksi.
- **Alternatives considered**: `next start` valid untuk deployment server biasa, tetapi tidak digunakan dengan keputusan export ini. Custom image loader, layanan gambar, API, dan server actions tidak diperlukan.
- **Evidence**: [Static exports](https://nextjs.org/docs/app/guides/static-exports), [Image](https://nextjs.org/docs/app/api-reference/components/image).

### Server-first dan interaksi native

- **Decision**: Layout/page Server Components; satu Catalog client island untuk query dan kategori. Native select, details/summary, dan anchor. Komponen foto kecil memakai onError sebagai client leaf untuk fallback.
- **Rationale**: Hanya grid yang perlu berubah; delapan item tidak butuh debounce, fetch, useEffect, state global, atau search engine. Fallback foto tetap perlu onError, bukan hanya CSS.
- **Alternatives considered**: Seluruh halaman client, modal rincian, router halaman produk, dan state manager ditolak karena menambah kompleksitas tanpa kebutuhan.
- **Evidence**: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).

### Logo, foto dan desain

- **Decision**: Gunakan logo asli WattUp! yang sudah disalin ke `public/brand/wattup-logo.png`; nama brand ditulis terpisah karena artwork tidak memuat huruf. Native CSS global cukup untuk satu halaman; tanpa Tailwind, paket ikon, atau library animasi. Native sans-serif system stack, teks tebal, dua warna brand ungu-kuning, solid fields, hard shadow.
- **Rationale**: Identitas sudah diberikan, tidak perlu logo rekaan. Palet logo mengesampingkan default satu aksen. CSS mendukung grid dan dua tema tanpa JavaScript tambahan. Gunakan next/image dengan dimensi tetap atau fill dalam area berasio; unoptimized menghindari kebutuhan server optimizer. Foto perlu disiapkan dalam ukuran web yang wajar, bukan mengandalkan resize runtime.
- **Alternatives considered**: Crop/recolor logo, monogram EE, remote foto acak, font unduhan, CSS framework, dan animasi kompleks ditolak.
- **Evidence**: [CSS](https://nextjs.org/docs/app/getting-started/css), [Image](https://nextjs.org/docs/app/api-reference/components/image). Logo PNG diperiksa 1254 x 1254; hash sumber dan salinan cocok.

### WhatsApp

- **Decision**: Anchor biasa ke `https://wa.me/{nomor}` dengan satu parameter text melalui URLSearchParams, jumlah awal 1, penerima tetap dari data toko. Nomor awal kosong; invalid/sold_out menghasilkan null, bukan tautan aktif.
- **Rationale**: Tidak membutuhkan WhatsApp API, token, billing, data pelanggan, atau order storage. URL encoding mempertahankan karakter khusus dan newline. Pengunjung sendiri yang mengirim pesan.
- **Alternatives considered**: API, bot, checkout, cart, serta nomor palsu ditolak. Validasi format tidak memastikan nomor aktif atau milik penjual.
- **Evidence**: [WhatsApp Click to Chat](https://faq.whatsapp.com/5913398998672934?helpref=faq_content); aturan resmi ditemukan lewat hasil pencarian subagent, ekstraksi halaman penuh tidak berhasil. Karena itu handoff dan kepemilikan nomor final tetap wajib diuji pemilik; tidak diklaim sudah diverifikasi.

### Quality gates

- **Decision**: Node built-in test runner + node:assert untuk satu test file; ESLint CLI, tsc, dan next build dijalankan terpisah. Modul utilitas TypeScript memakai sintaks erasable dan import relatif berakhiran `.ts` agar Node LTS bisa mengeksekusi tanpa test framework tambahan; tsconfig perlu mengizinkannya.
- **Rationale**: Cukup untuk validasi data/filter/URL. Uji browser manual tetap diperlukan untuk responsivitas, keyboard, gambar, tema, dan metadata. Node native TS tidak typecheck, sehingga tsc tetap wajib.
- **Alternatives considered**: Jest/Vitest/Playwright sebagai dependensi awal ditolak untuk proyek sekecil ini. Browser automation boleh memakai alat lingkungan bila tersedia tanpa menambah paket proyek.
- **Evidence**: [Next installation/lint](https://nextjs.org/docs/app/getting-started/installation), [ESLint configuration](https://nextjs.org/docs/app/api-reference/config/eslint), [Node TypeScript](https://nodejs.org/api/typescript.html).

## Resolved / remaining

Tidak ada keputusan arsitektur yang belum selesai. Konten produk asli, nomor WA, profil, alamat, jam buka, hosting dan izin foto adalah input rilis; bukan alasan menambah sistem. Uji install/build, audit browser/performa, dan uji tiga siswa masih pending implementasi, bukan hasil planning.
