# Metadata Cleaner

Alat CLI (Command Line Interface) yang kuat untuk menghapus metadata yang tidak diperlukan dari foto dan video Anda secara aman dan konsisten.

## Fitur Utama
- **Pembersihan Tanpa Hilang Kualitas (Lossless)**: Menghapus metadata tanpa melakukan pengkodean ulang (re-encoding) sehingga kualitas visual/audio tetap terjaga.
- **Dukungan Format Luas**: Mendukung format foto populer (JPG, PNG, WebP, HEIC, TIFF) dan video (MP4, MOV, MKV, WebM).
- **Fokus Privasi**: Menghapus EXIF, IPTC, XMP, geotag (lokasi), informasi pembuat, hak cipta (copyright), kredit (credit), identitas perangkat lunak, dan banyak lagi.
- **Deteksi Metadata AI**: Mampu mendeteksi dan menghapus metadata berbasis AI/provenance (seperti C2PA) jika tersimpan dalam tag standar.
- **Proses Batch**: Bersihkan seluruh isi folder sekaligus dengan satu perintah.
- **Mode Uji Coba (Dry-Run)**: Lihat apa yang akan dihapus tanpa benar-benar mengubah file asli.

## Prasyarat
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [ExifTool](https://exiftool.org/) (untuk metadata foto)
- [FFmpeg](https://ffmpeg.org/) (untuk metadata video)

## Instalasi
```bash
# Clone repository ini
git clone git@github.com:razaeldotexe/mtdt.git
cd mtdt

# Install dependensi
npm install

# Build proyek (kompilasi TypeScript)
npm run build
```

## Panduan Penggunaan
Gunakan perintah `npm run` untuk menjalankan script dengan mudah:

### 1. Scan Metadata (Melihat metadata yang ada)
```bash
npm run scan -- foto.jpg
```

### 2. Clean Metadata (Hapus metadata)
Secara default, hasil akan disimpan dengan awalan `cleaned_` di folder yang sama.
```bash
# Pembersihan standar
npm run clean -- foto.jpg

# Simpan ke folder output khusus
npm run clean -- foto.jpg -- --output ./hasil-aman
```

### 3. Batch Clean (Bersihkan satu folder sekaligus)
```bash
npm run batch -- ./koleksi-foto -- --output ./foto-bersih
```

## Opsi Lanjutan
- `--dry-run`: Menjalankan simulasi tanpa menulis file apapun.
- `--keep-basic-info`: Tetap mempertahankan beberapa metadata dasar (seperti MakerNotes).
- `--remove-all-metadata`: Mode agresif untuk menghapus seluruh tag metadata yang memungkinkan.
- `--list-tags`: Menampilkan daftar tag sebelum proses pembersihan dimulai.

## Penggunaan Sebagai Global CLI
Agar bisa dipanggil langsung dari mana saja:
```bash
npm run build
npm link
# Sekarang Anda bisa mengetik:
metadata-cleaner scan foto.jpg
```

## Lisensi
MIT
