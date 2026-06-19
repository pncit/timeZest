import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint flat config for timezest.
 *
 * Pragmatic first pass: @eslint/js + typescript-eslint recommended (non
 * type-checked) rules, scoped to src, with Prettier last to disable
 * formatting rules. Modeled on @pncit/fuze-api's config but without the
 * unicorn/import-x stack so the existing (never-linted) source passes
 * cleanly. Tighten over time as the codebase adopts the conventions in
 * CODE_STANDARDS.md.
 *
 * Named .mjs because this package is CommonJS (no "type": "module"); the
 * config itself uses ESM import syntax.
 */

export default [
  js.configs.recommended,

  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.config.js', '*.config.mjs', '*.config.ts'],
  },

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        // Vitest globals (config has test.globals: true)
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      // Core rules that TypeScript already handles or that conflict with TS
      // semantics. TypeScript catches undefined identifiers (with @types/node
      // providing console/setTimeout/etc.), and TS lets a type and a value
      // share a name (declaration merging), which core no-redeclare misreads.
      'no-undef': 'off',
      'no-redeclare': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'no-throw-literal': 'error',
    },
  },

  // Test files: relax a few rules.
  {
    files: ['**/*.test.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-undef': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // Prettier last to disable conflicting formatting rules.
  prettierConfig,
];
