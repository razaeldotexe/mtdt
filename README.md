
# Metadata Cleaner

A powerful CLI tool to securely and consistently remove unnecessary metadata from your photos and videos.

## Features
- **Lossless Stripping**: Removes metadata without re-encoding or affecting visual/audio quality.
- **Broad Support**: Supports common photo (JPG, PNG, WebP, HEIC, TIFF) and video (MP4, MOV, MKV, WebM) formats.
- **Privacy Focused**: Strips EXIF, IPTC, XMP, geotags, author info, software identifiers, and more.
- **AI-Metadata Aware**: Detects and can remove AI-generated/content credentials metadata if stored in standard tags.
- **Batch Processing**: Clean entire directories at once.
- **Dry-Run Mode**: Preview what would happen without modifying any files.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [ExifTool](https://exiftool.org/) (for photo metadata)
- [FFmpeg](https://ffmpeg.org/) (for video metadata)

## Installation
```bash
# Clone the repository
git clone https://github.com/youruser/metadata-cleaner.git
cd metadata-cleaner

# Install dependencies
npm install

# Build the project
npm run build
```

## Penggunaan Cepat (NPM)
Gunakan perintah `npm run` untuk menjalankan script tanpa perlu mengetik path lengkap:

### 1. Scan Metadata (Melihat metadata)
```bash
npm run scan -- photo.jpg
```

### 2. Clean Metadata (Hapus metadata)
```bash
# Hasil akan disimpan di folder yang sama dengan awalan 'cleaned_'
npm run clean -- photo.jpg

# Simpan ke folder khusus
npm run clean -- photo.jpg -- --output ./hasil
```

### 3. Batch Clean (Bersihkan satu folder)
```bash
npm run batch -- ./koleksi-foto -- --output ./aman
```

## Penggunaan Sebagai Global CLI
Anda bisa meng-install tools ini secara lokal ke sistem Anda agar bisa dipanggil langsung:

```bash
npm run build
npm link
# Sekarang Anda bisa mengetik langsung:
metadata-cleaner scan photo.jpg
```

### Advanced Options
- `--dry-run`: Don't actually write any files.
- `--keep-basic-info`: Keep basic metadata (like MakerNotes).
- `--remove-all-metadata`: Extremely aggressive stripping.
- `--list-tags`: Show metadata before cleaning.

## Technical Stack
- **TypeScript & Node.js**: Robust and type-safe development.
- **ExifTool**: Industry standard for photo metadata manipulation.
- **FFmpeg**: Powerful toolkit for video container handling.
- **Commander.js**: Intuitive CLI interface.
- **Vitest**: Modern testing framework.

## License
MIT
