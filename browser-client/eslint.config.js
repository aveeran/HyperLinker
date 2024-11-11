import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx}'], // Change to TypeScript file extensions
    ignores: ['dist'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.webextensions, // Add webextensions globals
      },
      parser: typescriptParser, // Use TypeScript parser
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: './tsconfig.json', // Specify the TypeScript config file
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules, // Add TypeScript ESLint rules
      ...typescriptEslint.configs['recommended-requiring-type-checking'].rules, // Recommended type-checking rules

      'react/jsx-no-target-blank': 'off',
      'react/react-in-jsx-scope': 'off', // Disable the need to import React with JSX
      'react/jsx-uses-react': 'off',     // Disable React unused variable checks for JSX
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    
      'no-unused-vars': 'off', // Turn off for JavaScript files
      '@typescript-eslint/no-unused-vars': 'off', // Turn off for TypeScript files
    }
  },
];
