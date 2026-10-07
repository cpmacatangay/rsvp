import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  {
    // global ignores: generated + vendored files (RULES.md tooling hygiene)
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '.git/**',
      'assets/**',
      'next-env.d.ts',
      // agent-harness skill folders (vendored tooling; real dirs after the
      // 2026-10-07 impeccable reinstall — no longer symlinks ESLint skips)
      '.agents/**',
      '.claude/**',
      '.opencode/**',
      '.playwright-mcp/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // RULES.md §5.2 size limits
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-params': ['warn', { max: 4 }],
      complexity: ['warn', { max: 10 }],
      'max-depth': ['warn', { max: 3 }],
      // RULES.md §5.4/.5.6 hygiene
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-throw-literal': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    // ops scripts (seed, db-check, drizzle helpers) legitimately print reports
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
];

export default eslintConfig;
