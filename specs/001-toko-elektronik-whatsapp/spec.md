# Feature Specification: Website Toko Elektronik dengan Pemesanan WhatsApp

**Feature Branch**: Tidak dibuat; spesifikasi tunggal untuk keseluruhan website.

**Created**: 2026-11-07

**Status**: Planning; nama WattUp! dan logo sudah diberikan, konten produk serta kontak final menunggu pemilik.

**Input**: Website satu toko penjualan peralatan elektronik untuk tugas sekolah kewirausahaan. Nama toko, logo, foto barang, katalog, dan pembelian melalui WhatsApp. Sederhana, tanpa login. Desain neobrutalism. Batasan teknologi dari pemesan: Next.js, dicatat di README sebagai arahan implementasi.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mengenal toko, memilih barang, lalu menghubungi penjual (Priority: P1)

Sebagai calon pembeli, saya membuka website tanpa akun, mengenali toko, melihat katalog dan informasi barang, lalu menekan tombol untuk memulai pemesanan melalui WhatsApp. Harga, stok, pembayaran, dan pengiriman dikonfirmasi bersama penjual di percakapan, bukan diproses website.

**Why this priority**: Satu alur ini memenuhi seluruh tujuan tugas kewirausahaan: memperkenalkan usaha, menawarkan barang, dan menghubungkan pembeli dengan penjual. Tidak dipecah menjadi spesifikasi per use case.

**Independent Test**: Buka beranda melalui ponsel, temukan produk, baca rinciannya, dan periksa bahwa tombol pembelian menuju WhatsApp toko dengan pesan sesuai produk. Pengujian tidak perlu mengirim pesan atau menyelesaikan transaksi.

**Acceptance Scenarios**:

1. **Given** pengunjung belum pernah membuka website, **When** beranda dibuka, **Then** nama toko, logo, penjelasan singkat, tombol `Lihat Produk`, dan navigasi terlihat tanpa login.
2. **Given** pengunjung berada di beranda, **When** memilih `Lihat Produk` atau menu `Produk`, **Then** pengunjung diarahkan ke bagian katalog pada halaman yang sama.
3. **Given** katalog berisi produk, **When** pengunjung melihat kartu, **Then** setiap kartu menampilkan foto, nama, kategori, harga Rupiah, status ketersediaan, tombol `Detail Produk`, dan tindakan sesuai status barang.
4. **Given** pengunjung memilih `Detail Produk`, **When** tautan dibuka, **Then** halaman detail statis menampilkan foto besar, harga, deskripsi, 3-5 spesifikasi, pratinjau draf WhatsApp, FAQ, dan tautan kembali ke katalog.
5. **Given** pencarian kosong dan kategori `Semua` aktif, **When** katalog ditampilkan, **Then** seluruh produk ditampilkan mengikuti urutan yang ditetapkan toko.
6. **Given** pengunjung memasukkan kata pencarian dan memilih kategori, **When** hasil diperbarui, **Then** hanya barang yang memenuhi keduanya tampil; pencarian nama tidak membedakan huruf besar/kecil dan mengabaikan spasi di awal/akhir.
7. **Given** tidak ada barang yang cocok, **When** hasil diperbarui, **Then** tampil `Produk tidak ditemukan` dan tombol `Reset Filter`; reset mengosongkan pencarian dan mengembalikan kategori ke `Semua`.
8. **Given** produk tersedia dan nomor toko valid, **When** pengunjung memilih `Beli via WhatsApp`, **Then** tujuan adalah nomor toko dengan draf pesan berisi nama toko, nama dan kode produk, jumlah 1, serta harga katalog; pesan belum dikirim otomatis.
9. **Given** produk berstatus habis, **When** kartu atau rincian ditampilkan, **Then** status `Habis` jelas dan tindakan pemesanan produk tidak aktif; kontak toko umum tetap tersedia jika nomor valid.
10. **Given** nomor WhatsApp toko belum diisi atau tidak valid, **When** website ditampilkan, **Then** semua tindakan menuju WhatsApp tidak aktif dan ada keterangan `Kontak toko belum tersedia`; tidak ada pengalihan ke nomor contoh.
11. **Given** pengunjung ingin tahu cara membeli, **When** membaca bagian `Cara Beli`, **Then** urutan pilih barang, chat penjual, konfirmasi harga/stok/ongkir, dan sepakati pembayaran terbaca; website tidak mengklaim pesanan atau pembayaran telah berhasil.
12. **Given** pengunjung membuka menu `Tentang` atau `Kontak`, **When** bagian terkait terlihat, **Then** profil usaha dan informasi kontak tersedia; data yang belum disediakan ditandai belum tersedia, bukan dibuat seolah nyata.
13. **Given** foto barang gagal dimuat, **When** kartu ditampilkan, **Then** area gambar tetap memiliki ukuran stabil dengan pengganti bertuliskan `Foto belum tersedia`; nama, harga, dan tindakan tetap dapat digunakan.
14. **Given** katalog tidak berisi barang, **When** bagian produk dibuka, **Then** tampil `Produk belum tersedia` dan tidak ada kartu atau jumlah barang fiktif.
15. **Given** pengunjung menggunakan layar 360, 768, atau 1440 piksel, **When** seluruh halaman dan rincian barang diperiksa, **Then** tidak ada gulir horizontal, teks terpotong, kontrol bertumpuk, atau konten tertutup navigasi.
16. **Given** pengunjung menggunakan keyboard, **When** menelusuri halaman, **Then** navigasi, pencarian, kategori, rincian, reset, dan tindakan pembelian dapat digunakan dengan fokus terlihat; status hasil pencarian diumumkan pembaca layar.
17. **Given** pengunjung memilih `Chat Toko`, **When** nomor valid, **Then** WhatsApp menampilkan sapaan umum dengan nama toko tanpa mengatasnamakan produk tertentu.
18. **Given** produk bernama panjang atau mengandung `&`, `+`, `#`, tanda tanya, atau baris baru dalam draf, **When** tombol pembelian dibuka, **Then** pesan tetap utuh dan tujuan tetap nomor toko yang sama.
19. **Given** koneksi lambat atau gambar masih dimuat, **When** pengunjung membaca katalog, **Then** informasi teks dan ruang gambar tetap stabil tanpa indikator yang mengklaim stok sedang diperiksa secara langsung.
20. **Given** preferensi perangkat terang atau gelap, **When** website dibuka, **Then** seluruh bagian mengikuti preferensi yang sama dengan teks, batas, dan tombol tetap terbaca; preferensi pengurangan gerak dihormati.

### Edge Cases

- WhatsApp tidak terpasang: gunakan jalur resmi yang dapat menawarkan aplikasi atau versi web. Website tidak menjamin keberhasilan aplikasi eksternal; tampilkan petunjuk untuk menggunakan WhatsApp Web atau perangkat yang mendukungnya.
- Pengunjung kembali dari WhatsApp: katalog tetap dapat digunakan; tidak muncul status transaksi berhasil atau stok berkurang.
- Nomor toko kosong/salah format: jangan membangun tujuan WhatsApp yang rusak atau memakai nomor rekaan. Validasi format tidak membuktikan kepemilikan atau keaktifan akun; pemilik wajib menguji nomor final.
- Harga atau stok berubah: harga adalah informasi katalog, bukan jaminan harga akhir. Tampilkan keterangan bahwa harga, stok, dan ongkir perlu dikonfirmasi penjual.
- Kata pencarian berisi karakter khusus: perlakukan sebagai teks biasa, bukan pola pencarian atau instruksi; hasil kosong tetap aman.
- Nama produk panjang: boleh membungkus beberapa baris tanpa menimpa harga atau tombol.
- Data produk tidak lengkap: barang tanpa kode unik, nama, kategori, harga Rupiah positif, atau status valid tidak boleh dipublikasikan. Foto kosong memakai pengganti; kode duplikat harus terdeteksi sebelum rilis.
- Alamat, jam buka, atau profil belum tersedia: tandai informasi belum tersedia; gunakan nama WattUp! dan logo yang diberikan. Jangan mengarang lokasi, jam operasional, garansi, ulasan, merek resmi, atau klaim penjualan.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Website MUST melayani tepat satu toko dan terbuka tanpa registrasi atau login. Semua kontak dan produk merujuk toko yang sama.
- **FR-002**: Website MUST memiliki satu beranda publik dengan urutan: header, hero, katalog, cara beli, tentang toko, kontak, dan footer; setiap produk memiliki halaman detail statis `/produk/{code}/`. Navigasi beranda memakai anchor.
- **FR-003**: Header MUST menampilkan nama dan logo toko serta menu `Produk`, `Cara Beli`, `Tentang`, dan `Kontak`. Hero MUST memuat satu judul, penjelasan singkat, dan tombol `Lihat Produk`. Nama dan logo tampil kembali di footer.
- **FR-004**: Katalog MUST menampilkan foto, nama, kategori, harga dengan format Rupiah, dan status `Tersedia` atau `Habis` pada setiap produk. Harga yang dipakai harus sama antara kartu, rincian, dan draf pesan.
- **FR-005**: Setiap barang MUST memiliki halaman detail statis, berisi foto utama, deskripsi, harga, 3-5 spesifikasi, pratinjau draf WhatsApp, FAQ native, dan produk terkait. Tidak ada varian atau paket rekaan, galeri sudut palsu, atau perbandingan barang.
- **FR-006**: Katalog MUST menyediakan pencarian nama serta filter satu kategori. Keduanya berlaku bersamaan. Nilai awal adalah pencarian kosong dan kategori `Semua`; hasil mengikuti urutan katalog awal tanpa fitur pengurutan.
- **FR-007**: Website MUST membedakan katalog kosong dari hasil pencarian kosong, menampilkan pesan sesuai konteks, menyediakan `Reset Filter` untuk hasil kosong, serta menyediakan pengganti foto dan ruang gambar tetap.
- **FR-008**: Produk tersedia MUST memiliki tombol berlabel konsisten `Beli via WhatsApp`. Produk habis MUST menampilkan status jelas dan tindakan pembelian nonaktif. Kontrol nonaktif tidak boleh tetap memiliki tujuan yang dapat diikuti.
- **FR-009**: Tindakan pembelian MUST membuka percakapan WhatsApp resmi ke nomor toko dengan pesan yang benar-benar sesuai barang, bukan mengirim otomatis. Jumlah selalu 1 sebagai awal percakapan; perubahan jumlah disepakati melalui chat.
- **FR-010**: Draf pembelian MUST memakai format pada bagian `Format Pesan` dan mempertahankan karakter serta pemisah baris. Membuka WhatsApp bukan bukti pesanan terkirim, diterima, dibayar, atau disetujui.
- **FR-011**: Bagian `Cara Beli` MUST menjelaskan pemilihan barang, pengiriman pesan oleh pembeli, konfirmasi harga/stok/ongkir oleh penjual, dan kesepakatan pembayaran/pengiriman di WhatsApp. Tidak boleh ada checkout atau pemungutan pembayaran di website.
- **FR-012**: Bagian `Tentang` MUST memuat profil singkat toko. Bagian `Kontak` MUST memuat nomor toko, alamat dan jam buka bila diberikan, serta tindakan `Chat Toko` dengan sapaan umum. Kontak tidak tersedia harus ditandai eksplisit.
- **FR-013**: Website MUST menonaktifkan semua tindakan WhatsApp ketika nomor kosong atau salah format. Nomor penerima MUST berupa nomor internasional hanya digit, tidak diawali nol, maksimum 15 digit; nomor Indonesia memakai awalan `62`. Website tidak memakai penerima dari masukan pengunjung.
- **FR-014**: Website MUST memakai Bahasa Indonesia, harga Rupiah tanpa pecahan, dan microcopy pembelian yang tidak menjanjikan stok langsung, ongkir otomatis, garansi, atau diskon yang tidak diberikan toko.
- **FR-015**: Website MUST memakai neobrutalism: tipografi sans-serif tebal, bidang warna solid, garis tebal, sudut tegas, bayangan keras tanpa blur, serta umpan balik tombol yang terasa ditekan. Tidak memakai glassmorphism, gradien dekoratif, carousel otomatis, atau animasi berulang.
- **FR-016**: Website MUST menyesuaikan layar 360-1440 piksel tanpa gulir horizontal; katalog memakai 1 kolom pada ponsel, 2 pada tablet, dan 3 pada desktop. Menu harus tetap dapat diakses tanpa kontrol yang saling menutupi.
- **FR-017**: Website MUST menyediakan label pencarian yang terlihat, teks alternatif gambar, struktur judul berurutan, fokus keyboard jelas, area target interaktif minimal 44 x 44 piksel, serta rasio kontras teks biasa minimal 4.5:1. Jumlah hasil dan keadaan kosong harus dapat diketahui pembaca layar.
- **FR-018**: Seluruh halaman MUST mengikuti preferensi terang/gelap perangkat secara konsisten, tanpa tombol pergantian tema khusus. Transisi interaktif hanya singkat dan dihentikan bila pengguna memilih pengurangan gerak.
- **FR-019**: Nama toko, logo, kontak, profil, kategori, dan daftar produk MUST dapat diganti pengembang tanpa fitur login atau panel pengelolaan. Data contoh MUST ditandai sebagai demo; nomor WhatsApp awal dibiarkan kosong sampai diberikan pemilik.
- **FR-020**: Website MUST menampilkan judul halaman serta deskripsi yang menyebut nama toko dan barang elektronik, memiliki ikon situs sesuai logo, dan dapat dibuka melalui alamat publik HTTPS setelah dirilis. Nama domain khusus tidak wajib.
- **FR-021**: Website MUST tidak meminta atau menyimpan nama pembeli, alamat, nomor telepon pengunjung, isi chat, atau riwayat pesanan. Tidak ada formulir pengumpulan data, pelacak pemasaran, atau pengiriman pesan WhatsApp otomatis.
- **FR-022**: Website MUST tidak menerbitkan produk dengan data wajib tidak valid atau kode duplikat. Foto pengganti tidak boleh menghalangi penggunaan nama, harga, rincian, dan tindakan pembelian.

### Format Pesan

Draf untuk `Beli via WhatsApp`:

```text
Halo {nama_toko}, saya ingin memesan:
Produk: {nama_produk}
Kode: {kode_produk}
Jumlah: 1
Harga katalog: {harga_rupiah}
Mohon konfirmasi ketersediaan, harga akhir, dan ongkir. Terima kasih.
```

Draf untuk `Chat Toko`:

```text
Halo {nama_toko}, saya ingin bertanya tentang produk elektronik yang tersedia.
```

Nama, kode, dan harga diisi dari barang yang dipilih. Identitas pembeli dan alamat tidak dimasukkan otomatis. Pembeli masih harus menekan kirim di WhatsApp.

### Key Entities *(include if feature involves data)*

- **Toko**: Satu identitas usaha dengan nama, logo, profil, nomor WhatsApp opsional sampai siap rilis, alamat opsional, jam buka opsional, serta penanda mode demo.
- **Kategori**: Kelompok barang dengan kode unik dan nama. Kategori contoh: `Peralatan Rumah`, `Audio`, dan `Aksesori Elektronik`. Pilihan `Semua` mencakup seluruh kategori.
- **Produk**: Kode unik, nama, kategori, harga Rupiah positif, foto beserta teks alternatif, deskripsi, 3-5 spesifikasi, dan status ketersediaan. Setiap produk dimiliki toko yang sama; bukan inventaris stok waktu nyata.
- **Draf pemesanan**: Teks sementara untuk satu produk, jumlah awal 1, dan harga katalog. Bukan pesanan tersimpan dan tidak memiliki nomor transaksi.

### Batasan Cakupan

**Termasuk**: Identitas dan logo toko, katalog bergambar, pencarian, filter kategori, halaman detail barang statis, status barang, pemesanan dan kontak WhatsApp, cara beli, profil, kontak, tampilan responsif, aksesibilitas dasar, metadata, serta rilis publik sederhana.

**Tidak termasuk**: Login, registrasi, multi-toko, admin, basis data pesanan, keranjang, checkout, payment gateway, unggah bukti bayar, chatbot, integrasi WhatsApp Business API, stok langsung, ongkir otomatis, pelacakan pengiriman, ulasan, voucher, wishlist, blog, serta dashboard statistik.

### Arah Visual dan Susunan Konten

- Kesan: toko elektronik anak sekolah yang berani dan rapi; bukan marketplace besar atau dashboard.
- Variasi desain 6/10, intensitas gerak 2/10, kepadatan visual 4/10. Neobrutalism diterapkan pada warna, garis, tipografi, dan tombol, bukan kompleksitas interaksi.
- Palet mengikuti referensi Stitch pengguna: kuning elektrik #FFE600, cyan #7DF4FF, magenta #BB0058, garis hitam, putih pudar; tipografi Space Grotesk, Work Sans, Space Mono disimpan lokal beserta lisensi OFL. Tema gelap memakai latar arang; seluruh bagian tetap satu tema dan memenuhi kontras. Logo asli tidak diwarnai ulang.
- Garis 2-3 piksel; bayangan keras offset 4 piksel tanpa blur; sudut 0-4 piksel konsisten. Fokus harus tetap terlihat di luar bayangan.
- Header ringkas; hero berisi teks rata kiri dan satu foto barang elektronik. Hero tidak boleh menunda akses ke katalog dengan dekorasi besar.
- Kartu produk konsisten, foto menampilkan barang yang sesuai, latar foto bersih, harga mudah dipindai. Status diletakkan sebagai teks, bukan warna saja.
- Bagian cara beli berupa urutan singkat; profil berupa paragraf ringkas; kontak berupa informasi dan satu label tindakan `Chat Toko`. Tidak menambah testimoni, logo mitra, angka penjualan, atau klaim pemasaran fiktif.
- Nama aplikasi dan toko: **WattUp!**, termasuk tanda seru. Logo yang diberikan disimpan di `public/brand/wattup-logo.png`; tampilkan utuh tanpa crop, distorsi, atau pewarnaan ulang. Logo berupa ikon tanpa teks, sehingga nama WattUp! tampil sebagai teks terpisah di sebelahnya.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Seluruh 20 skenario penerimaan dapat diperagakan tanpa membuat akun; pengujian pembelian berhenti pada pemeriksaan tujuan dan draf pesan, tanpa mengirim pesan nyata.
- **SC-002**: Dari kartu produk tersedia, satu tindakan `Beli via WhatsApp` cukup untuk membuka tujuan percakapan yang benar. Seluruh barang demo memiliki kecocokan nama, kode, jumlah 1, dan harga pada draf.
- **SC-003**: Dalam pengujian tugas dengan 3 siswa, seluruh peserta dapat menemukan barang tertentu dan membuka tujuan WhatsApp dalam paling lama 60 detik tanpa bantuan. Ini target uji, bukan hasil yang sudah dicapai.
- **SC-004**: Pada lebar layar 360, 768, dan 1440 piksel, seluruh bagian, kontrol, dan rincian dapat digunakan tanpa gulir horizontal atau konten terpotong, pada tema terang maupun gelap.
- **SC-005**: Seluruh alur utama dapat diselesaikan dengan keyboard; teks biasa memenuhi kontras minimal 4.5:1 dan seluruh foto memiliki alternatif teks yang sesuai.
- **SC-006**: Saat nomor toko kosong atau tidak valid dan saat barang habis, tidak ada tindakan pemesanan yang masih dapat membuka tujuan pembelian yang dilarang tersebut.
- **SC-007**: Pada pengujian ponsel dengan simulasi jaringan 4G, konten utama terlihat dalam paling lama 3 detik dan foto yang dimuat tidak menggeser kontrol pembelian dari posisi ruang yang telah disediakan.
- **SC-008**: Setelah rilis, satu URL HTTPS publik dapat dibuka melalui ponsel dan desktop tanpa login; seluruh navigasi bagian, gambar, dan tujuan kontak final lulus pemeriksaan. Rilis tidak dilakukan pada tahap penulisan spec.

## Assumptions

- Nama aplikasi dan toko **WattUp!** dikonfirmasi pemesan pada 2026-11-07. Logo PNG 1254 x 1254 piksel telah diberikan; identitas ini bukan placeholder. Lokasi folder tetap `elpaso-elektronik` agar referensi proyek tidak rusak.
- Konten awal berupa 8 produk contoh pada 3 kategori: rice cooker, kipas angin, setrika, ketel listrik, speaker Bluetooth, headset, charger USB, dan kabel USB. Harga, spesifikasi, dan foto contoh wajib ditandai demo; tidak menyatakan barang sungguhan tersedia. Minimal satu produk contoh berstatus `Habis` untuk pengujian.
- Produk elektronik diartikan sebagai peralatan elektronik rumah tangga, audio, dan aksesori. Tidak ada layanan perbaikan atau penyewaan dalam cakupan awal.
- Jumlah awal pembelian selalu 1; kebutuhan beberapa barang, variasi, atau jumlah berbeda dibahas melalui chat. Tidak ada keranjang atau formulir pemesanan.
- Nama dan logo sudah tersedia. Pemilik masih menyediakan nomor WhatsApp aktif, alamat bila ingin ditampilkan, jam buka, foto berizin, harga, spesifikasi, serta status barang sebelum penjualan nyata.
- Foto harus sesuai barang dan memiliki izin penggunaan. Foto demo tidak boleh dipresentasikan sebagai foto stok milik toko atau pengganti produk lain yang tidak sesuai.
- Website membutuhkan koneksi internet. WhatsApp dan keputusan transaksi berada di luar kendali website; nomor yang berformat benar belum tentu aktif.
- Data awal kecil dan jarang berubah. Pembaruan dilakukan pengembang; pengelolaan mandiri pemilik bukan kebutuhan tugas ini.
- Tahap aktif: perencanaan implementasi seluruh website melalui `/speckit-plan`. Pembuatan aplikasi, pengujian tampilan berjalan, dan deployment menunggu implementasi.
