"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const path_1 = __importDefault(require("path"));
const file_info_1 = require("../src/scanner/file-info");
(0, vitest_1.describe)('Scanner', () => {
    (0, vitest_1.it)('should exist and be a function', () => {
        (0, vitest_1.expect)(typeof file_info_1.getFileInfo).toBe('function');
    });
    // Since we don't have actual files, we just test if it's imported correctly
    // In a real environment, you'd add sample files to the repository
});
//# sourceMappingURL=scanner.test.js.map