
import { MetadataReport, CleaningResult } from '../types/index.js';

export function reportScan(report: MetadataReport) {
  console.log(`\n--- Scan Report: ${report.filePath} ---`);
  console.log(`File Type: ${report.fileInfo.mimeType} (${report.fileInfo.category})`);
  console.log(`Size: ${(report.fileInfo.size / 1024).toFixed(2)} KB`);
  
  console.log('\nMetadata Detected:');
  const summary = report.summary;
  const status = (found?: boolean) => found ? '✅ Found' : '❌ Not Found';
  
  console.log(`  EXIF:       ${status(summary.exif)}`);
  console.log(`  IPTC:       ${status(summary.iptc)}`);
  console.log(`  XMP:        ${status(summary.xmp)}`);
  console.log(`  Geotags:    ${status(summary.geotag)}`);
  console.log(`  Author:     ${status(summary.author)}`);
  console.log(`  Software:   ${status(summary.software)}`);
  console.log(`  Timestamp:  ${status(summary.timestamp)}`);
  console.log(`  Thumbnail:  ${status(summary.thumbnail)}`);
  console.log(`  AI/C2PA:    ${status(summary.aiMetadata)}`);
  console.log('------------------------------------\n');
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
