#!/usr/bin/env node
/**
 * Case Collision Checker
 * Fails build if files/folders differ only in casing
 */

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const errors = [];

function checkDirectory(dir, seen = new Map()) {
  try {
    const items = readdirSync(dir);

    for (const item of items) {
      // Skip node_modules, .git, dist, build directories
      if (['node_modules', '.git', 'dist', 'build', '.next', 'out'].includes(item)) {
        continue;
      }

      const fullPath = join(dir, item);
      const lowerItem = item.toLowerCase();

      // Check for case collision
      if (seen.has(lowerItem)) {
        const existing = seen.get(lowerItem);
        errors.push({
          type: 'case-collision',
          path1: existing,
          path2: fullPath,
          message: `Case collision detected:\n  - ${existing}\n  - ${fullPath}`
        });
      } else {
        seen.set(lowerItem, fullPath);
      }

      // Recurse into directories
      try {
        if (statSync(fullPath).isDirectory()) {
          checkDirectory(fullPath, new Map());
        }
      } catch (e) {
        // Skip if can't read
      }
    }
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e.message);
  }
}

console.log('🔍 Checking for case collisions...\n');

checkDirectory('./src');
checkDirectory('./public');

if (errors.length > 0) {
  console.error('❌ CASE COLLISION ERRORS FOUND:\n');
  errors.forEach(err => {
    console.error(err.message);
    console.error('');
  });
  console.error(`Found ${errors.length} case collision(s). Please fix before deploying.`);
  process.exit(1);
}

console.log('✅ No case collisions detected. Safe to build.\n');
process.exit(0);
