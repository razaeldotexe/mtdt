
export type FileCategory = 'photo' | 'video' | 'unknown';

export interface FileInfo {
  path: string;
  originalExtension: string;
  detectedExtension: string;
  mimeType: string;
  category: FileCategory;
  size: number;
  isMismatch: boolean;
}

export interface MetadataReport {
  filePath: string;
  fileInfo: FileInfo;
  rawMetadata: any;
  summary: {
    exif?: boolean;
    iptc?: boolean;
    xmp?: boolean;
    geotag?: boolean;
    author?: boolean;
    software?: boolean;
    timestamp?: boolean;
    thumbnail?: boolean;
    aiMetadata?: boolean;
  };
}

export interface CleaningOptions {
  outputDir?: string;
  dryRun?: boolean;
  backup?: boolean;
  keepBasicInfo?: boolean;
  removeAllMetadata?: boolean;
  listTags?: boolean;
}

export interface CleaningResult {
  originalPath: string;
  outputPath: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  metadataRemoved: string[];
}
