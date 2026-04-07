
import { ExifTool } from 'exiftool-vendored';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import { getFileInfo } from '../scanner/file-info.js';
import { CleaningOptions, CleaningResult } from '../types/index.js';

const exiftool = new ExifTool();

export async function cleanMetadata(filePath: string, options: CleaningOptions): Promise<CleaningResult> {
  const fileInfo = await getFileInfo(filePath);
  const fileName = path.basename(filePath);
  const outputDir = options.outputDir || path.dirname(filePath);
  const outputPath = path.join(outputDir, options.outputDir ? fileName : `cleaned_${fileName}`);

  if (options.dryRun) {
    return {
      originalPath: filePath,
      outputPath: outputPath,
      status: 'skipped',
      metadataRemoved: ['dry-run: no changes made'],
    };
  }

  try {
    if (fileInfo.category === 'photo') {
      await cleanPhoto(filePath, outputPath, options);
    } else if (fileInfo.category === 'video') {
      await cleanVideo(filePath, outputPath, options);
    } else {
      throw new Error(`Unsupported file type: ${fileInfo.mimeType}`);
    }

    return {
      originalPath: filePath,
      outputPath,
      status: 'success',
      metadataRemoved: ['All requested metadata stripped'],
    };
  } catch (error: any) {
    return {
      originalPath: filePath,
      outputPath,
      status: 'failed',
      error: error.message,
      metadataRemoved: [],
    };
  }
}

async function cleanPhoto(input: string, output: string, options: CleaningOptions) {
  const writeArgs: string[] = [];

  // Kita gunakan pendekatan menghapus SEMUA (-all=) jika removeAllMetadata aktif
  // Atau menghapus grup besar dan tag spesifik yang sering tertinggal
  if (options.removeAllMetadata) {
    writeArgs.push('-all=');
    writeArgs.push('-CommonArgs'); // Memastikan argumen sistem ikut bersih
  } else {
    // Default: hapus grup utama
    writeArgs.push('-EXIF=');
    writeArgs.push('-IPTC=');
    writeArgs.push('-XMP=');
    
    // Hapus tag spesifik yang sering lolos dari grup utama
    writeArgs.push('-Copyright=');
    writeArgs.push('-CopyrightNotice=');
    writeArgs.push('-Rights=');
    writeArgs.push('-Credit=');
    writeArgs.push('-Artist=');
    writeArgs.push('-Creator=');
    writeArgs.push('-AuthorsPosition=');
    writeArgs.push('-By-line=');
    writeArgs.push('-Caption-Abstract=');
    writeArgs.push('-ProfileCopyright='); // Copyright di dalam ICC Profile
    
    writeArgs.push('-ThumbnailImage=');
    writeArgs.push('-PreviewImage=');
    
    if (!options.keepBasicInfo) {
      writeArgs.push('-MakerNotes=');
      writeArgs.push('-Comment=');
      writeArgs.push('-Adobe='); // Metadata spesifik Adobe
    }
  }

  // Gunakan -all= secara eksplisit di argumen tambahan untuk hasil maksimal
  const extraArgs = ['-o', output];
  if (options.removeAllMetadata) {
    extraArgs.push('-all=');
  }

  // Menyiapkan object tags untuk exiftool-vendored
  const tagsToDelete = Object.fromEntries(
    writeArgs
      .filter(arg => arg.startsWith('-') && arg.endsWith('='))
      .map(arg => [arg.replace(/^-|=$/g, ''), null])
  );

  await exiftool.write(input, tagsToDelete, extraArgs);
}

async function cleanVideo(input: string, output: string, options: CleaningOptions) {
  return new Promise<void>((resolve, reject) => {
    let command = ffmpeg(input)
      .outputOptions('-map_metadata', '-1') // Strip global metadata
      .outputOptions('-map_chapters', '-1') // Strip chapters
      .videoCodec('copy') // Lossless
      .audioCodec('copy') // Lossless
      .on('end', () => resolve())
      .on('error', (err) => reject(err));

    // For each stream, also try to strip metadata
    // ffprobe can tell us how many streams, but generally we can try:
    command.outputOptions('-map', '0'); // All streams
    
    command.save(output);
  });
}

export async function closeCleanerExifTool() {
  await exiftool.end();
}
