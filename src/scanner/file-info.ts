
import fs from 'fs/promises';
import { fileTypeFromFile } from 'file-type';
import path from 'path';
import { FileCategory, FileInfo } from '../types/index.js';

const PHOTO_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/tiff',
];

const VIDEO_MIMES = [
  'video/mp4',
  'video/quicktime', // MOV
  'video/x-matroska', // MKV
  'video/webm',
  'video/x-msvideo', // AVI
];

export async function getFileInfo(filePath: string): Promise<FileInfo> {
  const stats = await fs.stat(filePath);
  const type = await fileTypeFromFile(filePath);
  
  let category: FileCategory = 'unknown';
  let mimeType = 'application/octet-stream';
  let extension = path.extname(filePath).slice(1);

  if (type) {
    mimeType = type.mime;
    extension = type.ext;
    if (PHOTO_MIMES.includes(type.mime)) {
      category = 'photo';
    } else if (VIDEO_MIMES.includes(type.mime)) {
      category = 'video';
    }
  }

  return {
    path: filePath,
    extension,
    mimeType,
    category,
    size: stats.size,
  };
}
