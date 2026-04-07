
import { ExifTool } from 'exiftool-vendored';
import ffmpeg from 'fluent-ffmpeg';
import { getFileInfo } from './file-info.js';
import { MetadataReport } from '../types/index.js';

const exiftool = new ExifTool();

export async function scanMetadata(filePath: string): Promise<MetadataReport> {
  const fileInfo = await getFileInfo(filePath);
  
  let rawMetadata: any;
  if (fileInfo.category === 'photo') {
    rawMetadata = await exiftool.read(filePath);
  } else if (fileInfo.category === 'video') {
    rawMetadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });
  } else {
    // Basic read for unknown files
    rawMetadata = await exiftool.read(filePath);
  }

  const summary = summarizeMetadata(rawMetadata, fileInfo.category);

  return {
    filePath,
    fileInfo,
    rawMetadata,
    summary,
  };
}

function summarizeMetadata(raw: any, category: string): MetadataReport['summary'] {
  const summary: MetadataReport['summary'] = {};
  
  if (category === 'photo') {
    summary.exif = !!(raw.EXIF || raw.Make || raw.Model);
    summary.iptc = !!(raw.IPTC);
    summary.xmp = !!(raw.XMP);
    summary.geotag = !!(raw.GPSLatitude || raw.GPSLongitude);
    summary.author = !!(raw.Artist || raw.Creator || raw.Byline);
    summary.software = !!(raw.Software || raw.CreatorTool);
    summary.timestamp = !!(raw.DateTimeOriginal || raw.CreateDate);
    summary.thumbnail = !!(raw.ThumbnailImage || raw.ThumbnailData);
  } else if (category === 'video') {
    const format = raw.format || {};
    const tags = format.tags || {};
    summary.timestamp = !!(tags.creation_time);
    summary.author = !!(tags.artist || tags.composer || tags.author);
    summary.software = !!(tags.encoder || tags.encoder_name);
    summary.geotag = !!(tags.location || tags.com_apple_quicktime_location_ISO6709);
  }
  
  // Detection for AI/Content Credentials (e.g. C2PA)
  if (raw.XMP && (JSON.stringify(raw.XMP).includes('c2pa') || JSON.stringify(raw.XMP).includes('provenance'))) {
    summary.aiMetadata = true;
  }

  return summary;
}

export async function closeExifTool() {
  await exiftool.end();
}
