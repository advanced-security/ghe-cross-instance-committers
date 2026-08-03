// @ts-check

import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["lib/**", "**/*.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.mts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2020,
      },
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs["flat/recommended"].rules,
    },
  },
  prettierConfig,
];
