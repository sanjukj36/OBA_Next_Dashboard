import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import * as noTagMisUse from './plugins/tag-misuse/dist/index.js';
import consoleDetector from "./plugins/console-detector/index.js"
import pluginQuery from '@tanstack/eslint-plugin-query'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "no-tag-misuse": noTagMisUse,
      "console-detector": consoleDetector,
    },
    rules: {
      "no-tag-misuse/no-tag-misuse" : "error",
      'console-detector/no-console': ['error', { allowedMethods: ['warn', 'error', 'info'] }]
    }
  },
  ...pluginQuery.configs['flat/recommended']
];

export default eslintConfig;
