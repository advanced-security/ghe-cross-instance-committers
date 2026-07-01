// @ts-check
const tseslint = require('@typescript-eslint/eslint-plugin');
const jestPlugin = require('eslint-plugin-jest');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['**/*.js'],
  },
  ...tseslint.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.mts'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2020,
      },
      globals: {
        ...jestPlugin.configs['flat/recommended'].languageOptions.globals,
      },
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      ...prettierConfig.rules,
    },
  },
];
