---
description: "Task implementasi satu website WattUp!, dependency-ordered, tanpa pemecahan per use case"
---

# Tasks: WattUp!

**Input**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/storefront.md](contracts/storefront.md), [quickstart.md](quickstart.md).
**Prerequisites**: Planning selesai; logo asli sudah ada. Status aktual ditandai per task; uji siswa, data final dan deployment tetap bersyarat.
**Tests**: Satu berkas pemeriksaan Node native sesuai plan dan skenario penerimaan spec; tidak menambah test framework. Tulis pemeriksaan sebelum fungsi implementasi, pastikan gagal, lalu hijau setelah fungsi tersedia. Validasi browser/performa bukan pengganti unit test.
**Organization**: Hanya satu story **US1 (P1)**, mencakup keseluruhan website sesuai permintaan. Tidak ada US2/US3 atau spec per use case.

## Format: `[ID] [P?] [Story] Description`

Checkbox tetap kosong sampai hasil task benar-benar diverifikasi. `[P]` hanya boleh dijalankan bersama task lain pada kelompok kesiapan yang dijelaskan di Dependencies, bukan izin melompati prasyarat. Path implementasi relatif terhadap root `/Users/gzaaa19/elpaso-elektronik`, bukan relatif folder skill.

## Path Conventions

Satu Next.js app di root: `app/`, `components/`, `lib/`, `public/`, `tests/`. Jangan membuat `frontend/`, `backend/`, database, API bisnis, login, cart, atau admin. Jangan scaffold ulang dengan opsi overwrite yang merusak `.specify/`, `specs/`, atau logo. Constitution masih template, bukan aturan yang sudah diratifikasi.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Pasang toolchain minimum tanpa mengganti lingkungan global atau mengarang versi kompatibel.

- [X] T001 Periksa runtime, gunakan Node.js 24 LTS secara project-local bila tersedia atau siapkan runtime terisolasi yang didukung tanpa mengubah Node global; buat `.nvmrc` berisi `24`, `package.json` bernama `wattup`, dan `package-lock.json`; instal Next.js App Router, React/react-dom sepadan, TypeScript, types Node/React, ESLint dan eslint-config-next; verifikasi versi/peer dependency aktual, pilih stable kompatibel, catat fallback TypeScript bila perlu, dan tetapkan scripts `dev: next dev`, `test: node --test tests/catalog.test.mjs`, `lint: eslint . --max-warnings=0`, `typecheck: tsc --noEmit`, `build: next build` tanpa `next start` atau `next lint`.
- [X] T002 [P] Konfigurasikan `tsconfig.json`, `next-env.d.ts`, dan `eslint.config.mjs` untuk strict TypeScript/Next, ESLint flat config core-web-vitals/typescript, noEmit serta allowImportingTsExtensions; modul `lib/` memakai sintaks erasable, `import type`, dan import relatif `.ts` agar test native Node tidak memerlukan transpiler; jangan menyalin config versi lama tanpa memeriksa dependency terpasang.
- [X] T003 [P] Buat `.gitignore` yang mengabaikan `node_modules/`, `.next/`, `out/`, `*.tsbuildinfo`, `.DS_Store`, `.env*` serta artefak kredensial bila ada; jangan abaikan `package-lock.json`, `.specify/`, `specs/`, dan `public/brand/wattup-logo.png`; tidak perlu menginisialisasi Git atau membuat commit pada task ini.

**Checkpoint**: Dependensi terpasang dengan lockfile, konfigurasi lint/typecheck tersedia, dokumen/aset lama tetap utuh. Script aplikasi belum harus lulus sebelum kode ada.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Batas deployment dan styling dasar. Selesaikan sebelum US1.

- [X] T004 Buat `next.config.ts` dengan `output: 'export'` dan `images: { unoptimized: true }`; pastikan tidak ada konfigurasi runtime backend, route handler, server action, remote image service, atau rewrite yang tidak didukung static export; output produksi harus `out/`.
- [X] T005 Buat fondasi `app/globals.css`: reset, box-sizing, font sans-serif sistem, semantic CSS custom properties ungu-kuning/putih pudar/arang, tema otomatis `prefers-color-scheme`, focus-visible, hard shadow tanpa blur, radius konsisten 0-4px, border 2-3px; jangan menambah CSS framework/font unduhan/ikon dekoratif atau menyembunyikan overflow global untuk menutupi layout rusak.

**Checkpoint**: Static export dan token tema siap. Tidak ada klaim aplikasi sudah berjalan; root layout/page dibuat dalam US1.

## Phase 3: User Story 1 - Mengenal toko, memilih barang, lalu menghubungi penjual (Priority: P1)

**Goal**: Pengunjung mengenali WattUp!, melihat/mencari barang dan rincian, lalu mendapat draf pembelian ke WhatsApp toko tanpa akun atau checkout.

**Independent Test**: Buka hasil build pada ponsel, pilih produk, baca rincian, periksa URL WhatsApp dan pesan cocok dengan produk. Kontak kosong harus menonaktifkan seluruh CTA. Dengan fixture nomor valid lokal, inspeksi href/decoded text tanpa membuka nomor atau mengirim pesan; barang habis tetap tidak dapat dibeli.

### Tests for User Story 1

- [X] T006 [P] [US1] Tulis `tests/catalog.test.mjs` memakai `node:test`/`node:assert/strict` dan import `lib/catalog.ts`/`lib/store.ts`; tetapkan kontrak fungsi `validateCatalog(store, categories, products)`, `filterProducts(products, query, categoryId)`, `formatPrice(price)`, `buildPurchaseUrl(store, product)`, dan `buildContactUrl(store)`; cakup semua validasi model termasuk duplikat, harga noninteger/tidak aman/nonpositif, kategori invalid, 3-5 specs, nomor kosong/0 awal/+ atau URL/kurang 8/lebih 15 digit, filter AND/trim/case-insensitive/literal/urutan awal, Rupiah tanpa pecahan, barang habis, kontak umum, fixed host/penerima, jumlah 1 dan round-trip `&`, `+`, `#`, `?`, Unicode/newline; jalankan `npm run test`, catat gagal karena modul/fungsi belum ada, jangan membuka URL fixture atau mengirim pesan.

### Implementation for User Story 1

- [X] T007 [US1] Buat tipe `Store`, `Category`, `Product` serta ekspor `store`, `categories`, `products` di `lib/store.ts` sesuai [data-model.md](data-model.md). Store: `name` "Tepat `WattUp!`; tampil termasuk tanda seru"; `logo` "`/brand/wattup-logo.png`; sumber asli tidak dimodifikasi"; `description` "Profil singkat nonkosong, tanpa klaim usaha rekaan"; `whatsapp` "Default `""`; hanya digit internasional 8-15 digit, digit pertama 1-9; nomor Indonesia memakai `62`"; `address` "Null menampilkan `Alamat belum tersedia`"; `openingHours` "Null menampilkan `Jam buka belum tersedia`"; `isDemo` "True selama produk/harga masih contoh; tampilkan pemberitahuan jelas". Category: `id` "Unik, stabil, tidak kosong"; `name` "Unik, tidak kosong"; gunakan `rumah`, `audio`, `aksesori`, sedangkan `all` hanya nilai UI. Product: `code` "Unik, tidak kosong; dipakai sebagai React key dan identitas pesan"; `name` "Tidak kosong; pencarian memakai nama ini"; `categoryId` "Harus merujuk kategori yang ada"; `price` "Bilangan bulat aman dan positif, unit Rupiah tanpa pecahan"; `image` "Path foto lokal di `/products/`; null memakai fallback"; `imageAlt` "Deskripsi barang nonkosong"; `description` "Deskripsi singkat nonkosong"; `specs` "3-5 pasangan dengan label/value tidak kosong"; `availability` hanya `available` atau `sold_out`, "Ditampilkan Tersedia atau Habis". Isi 8 barang contoh dari spec, minimal satu habis, harga/spec ditandai demo dan kontak kosong, tanpa identitas pelanggan.
- [X] T008 [US1] Implementasikan `validateCatalog`, `filterProducts`, dan `formatPrice` di `lib/catalog.ts` sesuai T006/T007: data wajib invalid/kode atau kategori duplikat memicu error dengan field/kode, bukan disaring diam-diam; `products=[]` tetap valid untuk empty state; nomor kontak invalid tidak melempar error build melainkan ditangani pembuat URL; pencarian substring literal, trim/case-insensitive, kategori AND, urutan tetap; harga memakai satu Intl.NumberFormat id-ID/IDR tanpa pecahan. Jalankan subset pemeriksaan yang sudah dapat lulus.
- [X] T009 [US1] Implementasikan `buildPurchaseUrl`/`buildContactUrl` di `lib/catalog.ts` dengan validasi nomor `/^[1-9]\d{7,14}$/`, fixed `https://wa.me/` dan satu `URLSearchParams` key `text`; jangan menormalisasi `08`, menghapus digit nol di tengah, mengambil penerima dari query pengunjung, atau encode ganda. Pembelian invalid/sold_out mengembalikan null, kontak umum hanya null untuk nomor invalid; pesan persis [spec.md](spec.md#format-pesan), nama WattUp!, kode/nama/harga dari barang yang sama, jumlah 1, tanpa kirim otomatis. Jalankan `npm run test` sampai hijau sebelum integrasi UI.
- [X] T010 [P] [US1] Siapkan foto lokal yang benar-benar sesuai 8 jenis barang di `public/products/` dan satu foto hero yang boleh memakai ulang foto produk; catat URL sumber, izin/lisensi, atribusi yang diwajibkan, dan status foto demo di `public/products/SOURCES.md`; gunakan alat native/terpasang untuk ukuran web dan kompresi tanpa menambah dependency aplikasi; jangan memakai foto acak, harga nyata rekaan, atau mengklaim foto stok toko. Jika foto berizin tidak dapat diperoleh, catat blocker dan slot fallback, jangan tandai task lengkap sebelum kriteria foto terpenuhi; jangan ubah `public/brand/wattup-logo.png`.
- [X] T011 [P] [US1] Buat client leaf `components/ProductImage.tsx` berbasis next/image dengan dimensi/aspect ratio tetap, alt deskriptif, `onError` dan fallback `Foto belum tersedia` untuk image null/rusak; pertahankan area produk 4:3, tinggi tidak runtuh saat loading/gagal, teks/kontrol tetap dapat dipakai, dan dukung preload hanya untuk foto hero yang benar-benar di atas fold; tidak ada layanan optimizer runtime.
- [X] T012 [US1] Buat `components/Catalog.tsx` sebagai client island penerima data serializable: label terlihat `Cari produk`/`Kategori`, native select Semua, useState hanya query/kategori, hasil turunan via filterProducts, jumlah hasil aria-live polite, foto/nama/kategori/harga/status setiap kartu, disclosure native `Detail Produk` dengan deskripsi dan 3-5 specs, CTA `Beli via WhatsApp` melalui helper. URL null berarti `<button disabled>` tanpa href dengan alasan terlihat; sold_out tampil `Habis`; bedakan `Produk belum tersedia` dari `Produk tidak ditemukan`, tambahkan `Reset Filter` untuk mengosongkan query/memilih all, tanpa fetch/state global/localStorage/debounce/modal.
- [X] T013 [US1] Buat Server Component `app/page.tsx` yang memanggil validateCatalog sebelum render, lalu menyusun header, hero, Catalog, cara beli, tentang, kontak, footer; anchor `#top`, `#produk`, `#cara-beli`, `#tentang`, `#kontak`; header/footer menampilkan logo utuh object-fit contain dan teks WattUp! terpisah, hero teks rata kiri maksimal 20 kata penjelasan + foto + `Lihat Produk`. Kontak memakai buildContactUrl/`Chat Toko`, nomor invalid tampil `Kontak toko belum tersedia`, alamat/jam buka null sesuai model, isDemo memunculkan pemberitahuan jelas. Jelaskan konfirmasi harga/stok/ongkir, pembeli menekan kirim sendiri, WhatsApp Web bila aplikasi tidak ada, tanpa status transaksi berhasil, ulasan, garansi, atau klaim usaha rekaan.
- [X] T014 [US1] Buat Server Component `app/layout.tsx` dengan `lang="id"`, struktur html/body, impor CSS, metadata title `WattUp! | Toko Elektronik` dan deskripsi toko; buat `app/icon.png` sebagai turunan proporsional logo untuk favicon memakai alat native/terpasang tanpa crop/recolor. Logo yang bersebelahan dengan teks WattUp! memakai alt kosong, logo mandiri alt WattUp!; bandingkan hash `public/brand/wattup-logo.png` tetap `2238d348c1d6b6f474304ab5c8cfc8830618a4d234920be33473dc299ee3bfd0`.
- [X] T015 [US1] Lengkapi `app/globals.css` untuk seluruh bagian nyata: katalog 1 kolom <768px, 2 mulai 768px, 3 mulai 1024px, container max1280px/padding ponsel16px; header/menu tidak bertumpuk, hero/CTA mudah terlihat, nama panjang aman, bayangan offset4px tanpa blur, area tombol minimal44x44px, fokus keyboard jelas, teks biasa kontras>=4.5:1 dalam dua tema termasuk pesan/label/disabled; hover/active singkat dan reduced motion mematikan transisi, tanpa animasi berulang/gradien dekoratif atau tema balik per bagian.
- [X] T016 [US1] Jalankan `npm run test`, `npm run lint`, `npm run typecheck`, dan `npm run build` dari `package.json`, perbaiki kegagalan pada `lib/catalog.ts`, `lib/store.ts`, `components/`, `app/` atau konfigurasi terkait tanpa menonaktifkan pemeriksaan; periksa `out/index.html`, aset/logo/favicon serta konten statis, lalu tambahkan hasil perintah aktual dan versi dependency terpasang ke `specs/001-toko-elektronik-whatsapp/quickstart.md`; jangan menyatakan build sudah sekaligus menjalankan lint.

**Checkpoint**: US1 dapat didemokan lokal dari `out/`; pemeriksaan fungsi dan build lulus, kontak default tetap kosong. Implementasi inti selesai, tetapi belum berarti seluruh uji browser, uji siswa atau rilis publik sudah lulus.

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Verifikasi menyeluruh, perbaikan nyata, dan penyerahan. Task rilis bersyarat tidak boleh dianggap selesai tanpa input/izin.

- [X] T017 Sajikan `out/` melalui `python3 -m http.server 3000 --bind 127.0.0.1 --directory out` atau port tersedia, periksa seluruh skenario S1-S14/S17-S19 di `specs/001-toko-elektronik-whatsapp/spec.md`: anchors, logo, rincian, filter/reset, urutan, empty catalog, zero matches, foto rusak/lambat, nama panjang, harga dan status; untuk kontak valid inspeksi href/draf menggunakan fixture lokal tanpa menavigasi WhatsApp, periksa nomor kosong/invalid/sold_out dan karakter khusus; pulihkan `lib/store.ts` ke data demo/kontak kosong setelah simulasi dan catat bukti/status tiap skenario di `specs/001-toko-elektronik-whatsapp/quickstart.md`.
- [ ] T018 Periksa S15/S16/S20 pada 360/768/1440px dalam terang/gelap, Tab/Shift+Tab/Enter/Space, label/alt/urutan judul, pengumuman hasil pembaca layar, kontras>=4.5:1, target44px dan reduced motion; perbaiki akar masalah di `app/globals.css`, `app/page.tsx`, `components/Catalog.tsx`, `components/ProductImage.tsx`, bukan menyembunyikan konten/scroll, lalu catat hasil aktual di `specs/001-toko-elektronik-whatsapp/quickstart.md`; tidak ada console error, request WhatsApp otomatis, cookies aplikasi, penyimpanan data pribadi atau state pesanan palsu.
- [X] T019 Audit halaman hasil build dengan Lighthouse mobile/simulasi4G, ukur konten utama<=3detik/LCP<2.5detik/CLS<0.1 dan byte gambar; perbaiki ukuran/preload yang perlu di `public/products/`, `app/page.tsx`, `components/ProductImage.tsx` dan CSS, jalankan ulang gates T016 bila ada perubahan; simpan kondisi, angka aktual dan keterbatasan INP lapangan di `specs/001-toko-elektronik-whatsapp/quickstart.md`, jangan mengganti hasil tak tercapai dengan angka contoh.
- [X] T020 Perbarui `README.md` dengan cara edit `lib/store.ts`, ganti aset berizin di `public/products/`, isi nomor internasional tanpa '+', batas validasi bukan bukti kepemilikan, mode demo dan perintah install/dev/test/lint/typecheck/build/preview out; selaraskan `specs/001-toko-elektronik-whatsapp/quickstart.md` dengan kode aktual, nyatakan hasil nyata/pending/blocker dan tidak ada backend; jangan memberi instruksi next start, tidak ada deployment diam-diam.
- [ ] T021 Setelah peserta tersedia, lakukan SC-003 bersama 3 siswa: masing-masing mencari barang dan menemukan tujuan WhatsApp dalam <=60detik tanpa bantuan/pesan nyata; catat durasi dan hasil per peserta tanpa data pribadi di `specs/001-toko-elektronik-whatsapp/quickstart.md`. Bila peserta belum tersedia, task tetap kosong/pending, bukan dianggap lolos dari simulasi agen.
- [ ] T022 Setelah pemilik memberi data final, ganti nomor/profil/harga/spec/status di `lib/store.ts` serta foto/izin di `public/products/` dan `public/products/SOURCES.md`, minta pemilik memastikan akun penerima dan lakukan handoff nyata sendiri; hanya ubah isDemo=false jika semua konten jualan memang nyata, jalankan ulang T016-T018 dan catat persetujuan serta hasil di `specs/001-toko-elektronik-whatsapp/quickstart.md`. Tanpa data final, demo tetap sah tetapi task penjualan nyata ini pending; jangan meminta password/token di chat.
- [ ] T023 Hanya setelah T022, gates dan izin deployment eksplisit tersedia, deploy isi `out/` ke static hosting HTTPS pilihan pemilik, verifikasi baca kembali URL final dari ponsel/desktop untuk assets/anchors/metadata/CTA tanpa login sesuai SC-008, lalu catat URL dan bukti pemeriksaan aktual di `README.md` dan `specs/001-toko-elektronik-whatsapp/quickstart.md`; tanpa akun/izin/URL final, biarkan task pending, jangan menganggap build lokal sebagai rilis publik.

**Checkpoint**: Demo sekolah cukup setelah T020 dengan hasil teknis nyata dan batasan tercatat. Kriteria siswa dan rilis publik baru selesai setelah T021-T023 benar-benar dilakukan. Jangan menandai seluruh feature selesai hanya karena fase kode selesai.

## Dependencies & Execution Order

### Phase Dependencies

- Setup: T001 dahulu; T002 dan T003 dapat paralel setelah T001.
- Foundation: T004 lalu T005 setelah Setup; seluruhnya memblokir US1.
- US1: setelah Foundation, T006/T010/T011 dapat mulai sebagai kelompok paralel berbeda file. T006 harus gagal sebelum T007-T009. T010 dan T011 tidak bergantung pada data atau test yang belum ditulis.
- US1 jalur utama: T006, T007, T008, T009, T012, T013, T014, T015, T016. T012 menunggu T010/T011 agar path dan komponen foto benar; T013 juga menunggu foto hero T010. T016 menunggu seluruh kode/aset selesai.
- Polish: T017, T018, T019, T020 berurutan; semua mengubah catatan quickstart dan mungkin kode yang sama, sehingga tidak diberi `[P]`.
- T021 bergantung T020 dan peserta; T022 bergantung T020 plus data/persetujuan pemilik; keduanya dijalankan serial bila mengedit quickstart yang sama. T023 bergantung T022, technical gates, dan izin hosting. Status T021 tetap dilaporkan terpisah bila belum tersedia saat rilis.

### User Story Dependencies

Hanya **US1 P1**. Tidak bergantung story lain; Store/Category/Product dan seluruh kontrak storefront/WhatsApp melayani US1. Tidak ada endpoint bisnis yang perlu task API tambahan.

### Dependency Graph

```text
T001
  T002 + T003 (paralel)
  T004, T005
  T006 + T010 + T011 (paralel; file berbeda)
  T007, T008, T009 (setelah T006 RED)
  T012 (menunggu T009/T010/T011)
  T013, T014, T015, T016
  T017, T018, T019, T020
  T021 (peserta) / T022 (data pemilik; edit catatan secara serial)
  T023 (setelah T022 + izin deploy)
```

## Parallel Example: User Story 1

Setelah T001-T005 selesai, tiga pekerjaan berikut boleh berjalan bersama:

```text
Pekerja A: T006, tests/catalog.test.mjs; tetapkan kontrak fungsi dan rekam RED.
Pekerja B: T010, public/products/ dan SOURCES.md; foto dan izin, tidak edit lib/store.ts.
Pekerja C: T011, components/ProductImage.tsx; props serializable, fallback gambar, tidak edit CSS global.
```

Setelah T006 gagal, pekerja A lanjut T007-T009; B/C boleh menyelesaikan aset/komponen. Integrator baru menjalankan T012 setelah ketiganya siap. Tidak memparalelkan dua task yang mengedit `lib/catalog.ts`, `app/globals.css` atau `quickstart.md` bersama.

## Requirement Coverage

`S` adalah skenario User Story 1 di spec. Tabel ini cakupan pekerjaan, bukan hasil uji lulus.

| Requirements | Tasks | Penerimaan |
| --- | --- | --- |
| FR-001, FR-002, FR-003 | T012-T014, T017 | S1-S2, S12 |
| FR-004, FR-005 | T007-T008, T010-T012, T017 | S3-S4 |
| FR-006, FR-007 | T006, T008, T011-T012, T017 | S5-S7, S13-S14, S19 |
| FR-008, FR-009, FR-010 | T006, T009, T012, T017 | S8-S10, S18 |
| FR-011, FR-012 | T013, T017 | S11-S12, S17 |
| FR-013 | T006-T009, T012-T013, T017, T022 | S10, S17; SC-006 |
| FR-014, FR-019 | T007-T009, T012-T013, T020, T022 | S3, S8, S11-S12 |
| FR-015, FR-016, FR-017, FR-018 | T005, T011-T015, T018 | S15-S16, S20; SC-004-SC-005 |
| FR-020 | T014, T017, T023 | SC-008 |
| FR-021 | T009, T012-T013, T018 | S8, S11; inspeksi privasi |
| FR-022 | T006-T008, T011, T013, T016-T017 | S13 dan edge case data invalid |
| SC-001, SC-002, SC-006 | T016-T018 | seluruh 20 skenario, harga/draf/penerima |
| SC-003 | T021 | 3 siswa, <=60detik |
| SC-007 | T019 | ukur performa dan layout stabil |
| SC-008 | T022-T023 | data final dan URL publik |

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Selesaikan Setup dan Foundation tanpa perlu backend atau konstitusi rekaan.
2. Tulis pemeriksaan US1, buktikan RED, bangun data/fungsi/aset/halaman sampai T016 lulus.
3. Jalankan T017-T020 sebelum menyerahkan demo sekolah; tanpa nomor final, tombol WhatsApp memang nonaktif.
4. Untuk demo kemampuan handoff, gunakan fixture lokal hanya inspeksi URL lalu pulihkan kontak kosong. Jangan menghubungi nomor contoh.
5. Minta data pemilik/peserta/izin rilis hanya ketika melaksanakan T021-T023, bukan menghambat implementasi katalog.

### Incremental Delivery

Satu story tetap satu deliverable menyeluruh. Increment internal: toolchain dan token; fungsi teruji; katalog dan halaman utuh; verifikasi demo; lalu validasi siswa/konten nyata/rilis bila tersedia. Jangan menciptakan story kedua untuk login/admin atau fitur di luar scope.

## Notes

- Semua task masih kosong: dokumen ini tidak memasang dependency, membangun aplikasi, menjalankan test aplikasi, atau melakukan deploy.
- `.specify/extensions.yml` tidak ada pada pemeriksaan sebelum/sesudah generasi; hook before_tasks/after_tasks tidak terdaftar.
- Git repository/branch belum ada; feature resolver ID bukan branch Git. Tidak ada task commit otomatis.
- Nomor aktif, data/foto nyata, 3 siswa, akun hosting, dan izin deploy adalah dependensi manusia/eksternal yang dicatat, bukan hasil yang boleh diisi rekaan.
- Eksekusi berikutnya `/speckit-implement`; pertahankan satu feature untuk seluruh website.
