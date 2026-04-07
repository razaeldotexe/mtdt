
import { MetadataReport, CleaningResult } from '../types/index.js';

export function reportScan(report: MetadataReport) {
  const { fileInfo, summary, rawMetadata } = report;
  
  console.log(`\n====================================================`);
  console.log(`📊 LAPORAN SCAN METADATA`);
  console.log(`====================================================`);
  console.log(`📁 File      : ${fileInfo.path}`);
  console.log(`Format Asli: .${fileInfo.originalExtension.toUpperCase()}`);
  console.log(`Isi Deteksi: ${fileInfo.mimeType} (.${fileInfo.detectedExtension.toUpperCase()})`);
  
  if (fileInfo.isMismatch) {
    console.log(`⚠️  PERINGATAN: Ekstensi file tidak sesuai dengan isinya!`);
    console.log(`    (File bernama .${fileInfo.originalExtension.toUpperCase()} tapi sebenarnya adalah .${fileInfo.detectedExtension.toUpperCase()})`);
  }

  console.log(`Ukuran    : ${(fileInfo.size / 1024).toFixed(2)} KB`);
  console.log(`Kategori  : ${fileInfo.category}`);
  console.log(`----------------------------------------------------`);

  const status = (found?: boolean) => found ? '✅ TERDETEKSI' : '❌ BERSIH';
  
  console.log(`🔍 STATUS RINGKAS:`);
  console.log(`  - EXIF Data        : ${status(summary.exif)}`);
  console.log(`  - IPTC Data        : ${status(summary.iptc)}`);
  console.log(`  - XMP Data         : ${status(summary.xmp)}`);
  console.log(`  - Lokasi (GPS)     : ${status(summary.geotag)}`);
  console.log(`  - Metadata AI/C2PA : ${status(summary.aiMetadata)}`);
  console.log(`  - Thumbnail        : ${status(summary.thumbnail)}`);
  
  console.log(`\n👤 INFORMASI KEPEMILIKAN & IDENTITAS:`);
  console.log(`  - Hak Cipta (Copyright) : ${status(summary.author || !!rawMetadata.Copyright || !!rawMetadata.ProfileCopyright)}`);
  console.log(`  - Kredit (Credit)      : ${status(!!rawMetadata.Credit || !!rawMetadata.Byline)}`);
  console.log(`  - Pembuat (Artist)     : ${status(!!rawMetadata.Artist || !!rawMetadata.Creator)}`);
  console.log(`  - Software/Device      : ${status(summary.software)}`);
  console.log(`  - Waktu (Timestamp)    : ${status(summary.timestamp)}`);

  if (summary.aiMetadata) {
    console.log(`\n⚠️  PERINGATAN: File ini mengandung metadata 'Content Credentials' (AI/Provenance).`);
  }

  console.log(`====================================================\n`);
}

export function reportCleanResult(result: CleaningResult) {
  if (result.status === 'success') {
    console.log(`✅ Success: ${result.originalPath} -> ${result.outputPath}`);
  } else if (result.status === 'skipped') {
    console.log(`⏭️ Skipped (Dry Run): ${result.originalPath}`);
  } else {
    console.log(`❌ Failed: ${result.originalPath}`);
    console.log(`   Error: ${result.error}`);
  }
}
