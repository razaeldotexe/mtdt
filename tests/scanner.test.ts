
import { describe, it, expect } from 'vitest';
import path from 'path';
import { getFileInfo } from '../src/scanner/file-info.js';

describe('Scanner', () => {
  it('should exist and be a function', () => {
    expect(typeof getFileInfo).toBe('function');
  });

  // Since we don't have actual files, we just test if it's imported correctly
  // In a real environment, you'd add sample files to the repository
});
