
#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import fs from 'fs/promises';
import { scanMetadata, closeExifTool } from '../scanner/metadata-scanner.js';
import { cleanMetadata, closeCleanerExifTool } from '../cleaner/metadata-cleaner.js';
import { reportScan, reportCleanResult } from '../reporters/terminal-reporter.js';
import { CleaningOptions } from '../types/index.js';

const program = new Command();

program
  .name('metadata-cleaner')
  .description('A tool to remove unnecessary metadata from photos and videos')
  .version('1.0.0');

program
  .command('scan <input>')
  .description('Scan a file for metadata')
  .action(async (input) => {
    try {
      const report = await scanMetadata(input);
      reportScan(report);
    } catch (error: any) {
      console.error(`Error scanning file: ${error.message}`);
    } finally {
      await closeExifTool();
    }
  });

program
  .command('clean <input>')
  .description('Clean metadata from a file')
  .option('-o, --output <dir>', 'Output directory')
  .option('--dry-run', 'Run without writing changes')
  .option('--keep-basic-info', 'Keep some basic metadata tags')
  .option('--remove-all-metadata', 'Aggressively remove all metadata tags')
  .option('--list-tags', 'List tags before cleaning')
  .action(async (input, options) => {
    try {
      if (options.listTags) {
        const report = await scanMetadata(input);
        reportScan(report);
      }
      
      const result = await cleanMetadata(input, options);
      reportCleanResult(result);
    } catch (error: any) {
      console.error(`Error cleaning file: ${error.message}`);
    } finally {
      await closeCleanerExifTool();
      await closeExifTool();
    }
  });

program
  .command('batch <dir>')
  .description('Batch clean all supported files in a directory')
  .option('-o, --output <dir>', 'Output directory')
  .option('--dry-run', 'Run without writing changes')
  .action(async (dir, options) => {
    try {
      const files = await fs.readdir(dir);
      console.log(`Starting batch process for ${files.length} items in ${dir}...\n`);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = await fs.stat(fullPath);
        
        if (stats.isFile()) {
          const result = await cleanMetadata(fullPath, options);
          reportCleanResult(result);
        }
      }
    } catch (error: any) {
      console.error(`Error in batch processing: ${error.message}`);
    } finally {
      await closeCleanerExifTool();
    }
  });

program.parse(process.argv);
