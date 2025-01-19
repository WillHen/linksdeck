import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Note: there should be no other properties in this object
    ignores: [
      'node_modules/*',
      'playwright-report/*',
      '.next/*',
      'supabase/*',
      'jest.setup.ts',
      'postcss.config.js',
      'tailwind.config.ts'
    ]
  },
  {
    settings: {
      react: { version: '19' }
    },
    rules: {
      ...pluginReact.configs['jsx-runtime'].rules
    }
  }
];
