# Implementation Plan: WattUp!

**Branch**: Tidak ada Git repository/branch. Resolver Spec Kit mengembalikan identitas feature `001-toko-elektronik-whatsapp`, bukan bukti branch Git.
**Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)
**Input**: `specs/001-toko-elektronik-whatsapp/spec.md`; nama aplikasi **WattUp!** dan logo lampiran dari pemesan.
**Status**: Phase 0 research dan Phase 1 design selesai. Implementasi belum dimulai.

## Summary

Satu website katalog delapan produk demo dari satu toko, tiga kategori, tanpa akun. Semua pembelian melalui draf WhatsApp; tidak ada pesanan tersimpan, pembayaran, admin, atau backend. Next.js App Router + TypeScript, CSS native neobrutalism kuning elektrik–cyan–magenta mengikuti referensi Stitch, logo WattUp! tetap asli. Static export membuat deploy cukup file HTML/CSS/JS.

## Technical Context

**Language/Version**: TypeScript stable kompatibel Next.js, strict mode. Baseline Node.js 24 LTS; mesin saat planning Node v25.2.1/npm 11.7.0. Tidak mengganti runtime global pada tahap ini.

**Primary Dependencies**: Next.js App Router dan React/react-dom versi sepadan; dev dependency TypeScript, types React/Node, ESLint, eslint-config-next. Metadata teramati: Next 16.4.5, React 19.3.1, TypeScript 7.0.2. Kecocokan install/build belum diuji; pin versi dan package-lock pada implementasi sesuai [research](research.md).

**Storage**: Modul TypeScript lokal untuk toko/kategori/produk; gambar lokal public. Tidak ada database, API bisnis, cookie, localStorage, atau data pembeli.

**Testing**: Satu `tests/catalog.test.mjs` dengan node:test dan node:assert, impor langsung fungsi murni TypeScript erasable. Scripts `test`, `lint`, `typecheck`, `build` terpisah. Validasi browser manual/alat lingkungan mengikuti [quickstart](quickstart.md); tidak menambah test framework.

**Target Platform**: Browser modern ponsel/desktop; lebar uji 360, 768, 1440px; tema terang/gelap otomatis. Deployment static hosting HTTPS.

**Project Type**: Satu Next.js web app, beranda publik `/` dengan anchors dan delapan halaman detail statis `/produk/[code]/`. Bukan monorepo frontend/backend.

**Performance Goals**: Konten utama <=3 detik pada simulasi 4G, target LCP <2.5s/CLS <0.1; INP <200ms memerlukan data interaksi memadai. Ukuran gambar disiapkan sebelum build. Semua ini target, belum diukur.

**Constraints**: `output: 'export'`, `images.unoptimized: true`; tidak ada next start, server actions, route handlers, dynamic cookies, optimizer runtime, atau layanan gambar. Tanpa login, cart, checkout, panel admin. Nomor WA kosong membuat CTA nonaktif. Logo asli dipertahankan.

**Scale/Scope**: 1 toko, 8 barang contoh, 3 kategori, 1 user journey menyeluruh, 22 requirement, 20 skenario penerimaan. Perubahan konten perlu rebuild/deploy. Tidak ada target trafik fiktif.

## Constitution Check

`.specify/memory/constitution.md` masih template belum diratifikasi. Tidak ada prinsip konstitusi yang dikarang atau dinyatakan lolos secara palsu. Gate di bawah berasal dari batasan eksplisit pemesan dan spec, bukan ratifikasi constitution baru.

| Gate | Sebelum research | Sesudah design |
| --- | --- | --- |
| Stack Next.js | PASS: diwajibkan | PASS: App Router + static export |
| Satu feature seluruh website | PASS | PASS: satu spec dan satu plan |
| Simpel, tanpa login/admin/backend | PASS | PASS: data lokal dan browser state kecil |
| Pembelian hanya via WhatsApp | PASS | PASS: anchor, draf, tidak kirim otomatis |
| Keamanan penerima dan privasi | PASS: kontak awal kosong | PASS: validasi nomor, URL encoding, tidak simpan pelanggan |
| Identitas WattUp! dan logo diberikan | PASS: sumber tersedia | PASS: logo disalin utuh, hash identik |
| Responsif dan aksesibel | PASS sebagai requirement | PASS sebagai desain; uji aktual pending |

Tidak ada pelanggaran cakupan yang membutuhkan pengecualian. Constitution formal tetap belum ditetapkan, bukan blocker buatan untuk tugas sekolah.

## Project Structure

### Documentation (this feature)

```text
specs/001-toko-elektronik-whatsapp/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/storefront.md
└── checklists/requirements.md
```

`tasks.md` baru dibuat oleh `/speckit-tasks`, tidak termasuk output tahap ini.

### Source Code (repository root)

Struktur target saat implementasi; hanya logo sudah ada, bukan klaim kode berikut sudah dibuat.

```text
app/
├── layout.tsx         # lang, metadata, font system, CSS
├── page.tsx           # validasi data, bagian statis, Catalog
├── globals.css        # token, tema, layout, state, responsif
└── icon.png           # turunan logo proporsional untuk favicon
components/
├── Catalog.tsx        # client: query, kategori, hasil, kartu/tautan detail
└── ProductImage.tsx   # client leaf: next/image dan fallback onError
lib/
├── store.ts           # tipe dan data lokal, nomor WA awal kosong
└── catalog.ts         # validasi, filter, harga, URL murni
public/
├── brand/wattup-logo.png   # sudah ada: sumber PNG tanpa perubahan
└── products/              # foto lokal berizin + SOURCES.md
tests/catalog.test.mjs    # satu berkas pemeriksaan fungsi murni
next.config.ts
eslint.config.mjs
tsconfig.json
package.json
package-lock.json
```

**Structure Decision**: App tunggal di root yang sudah berisi Spec Kit; jangan menjalankan scaffold yang menimpa dokumen/aset. Tidak perlu generic services/repositories, shared UI library, provider, abstraction layer, atau folder backend. Teks dan struktur statis cukup di page; komponen baru hanya jika interaksi benar-benar butuh boundary client.

## Phase 0: Research Decisions

Lihat [research.md](research.md). Keputusan selesai: Node LTS, static export, unoptimized local images, native CSS/font lokal berlisensi OFL, Catalog client island, halaman detail static generation, WA via URLSearchParams, test runner native, lint terpisah. Tidak ada unknown arsitektur tersisa.

## Phase 1: Design

- [data-model.md](data-model.md): bentuk Store/Category/Product, validasi data wajib dan state sementara. Data invalid/kode duplikat menghentikan build; nomor toko invalid tetap memperbolehkan demo dengan CTA mati.
- [contracts/storefront.md](contracts/storefront.md): anchor IDs, microcopy, state kosong/foto rusak, tautan WA, penggunaan logo, aksesibilitas, tema dan responsif. Tidak ada kontrak API karena tidak ada API bisnis.
- [quickstart.md](quickstart.md): scripts target, uji fungsi, inspeksi browser dan rilis. Panduan belum dapat dijalankan sampai kode dibuat.
- Metadata memakai WattUp!, favicon dari logo, nama di luar artwork. Logo 1254 x 1254 piksel disimpan di `public/brand/wattup-logo.png`; SHA-256 `2238d348c1d6b6f474304ab5c8cfc8830618a4d234920be33473dc299ee3bfd0` sama dengan lampiran.
- Foto asli/harga/nomor belum ada: demo dilabeli, kontak kosong; tidak mengarang bisnis nyata. Palet kuning–cyan–magenta mengikuti referensi pengguna; logo sumber tidak diubah.

## Verification and Handoff

Validasi planning: periksa file wajib, link dokumen, 22 FR/20 skenario tetap utuh, spec aktif, tidak ada placeholder plan atau penanda klarifikasi; pastikan semua dokumen konsisten memakai static export, tidak memberi perintah next start. Hash logo sumber dan salinan sudah dibandingkan. Tidak ada extension hook before_plan/after_plan karena `.specify/extensions.yml` tidak ada.

Belum dilakukan: instalasi, typecheck, lint aplikasi, unit tests aplikasi, build, audit browser, uji siswa, atau deploy. Konten bisnis final dan kepemilikan nomor wajib diperiksa sebelum penjualan nyata, bukan hambatan menyusun tasks.

**Next**: `/speckit-tasks` untuk satu feature aktif. Tidak membuat spec per use case.

## Complexity Tracking

Tidak ada pelanggaran gate atau kompleksitas tambahan yang perlu pembenaran. Native platform didahulukan; framework tambahan tidak diperlukan.
