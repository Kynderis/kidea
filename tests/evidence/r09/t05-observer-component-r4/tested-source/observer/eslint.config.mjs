import {createRequire}from 'node:module';
const require=createRequire(new URL('../web/package.json',import.meta.url));
const js=require('@eslint/js');
export default [{files:['**/*.mjs'],languageOptions:{ecmaVersion:2025,sourceType:'module',globals:{process:'readonly',console:'readonly',URL:'readonly',setTimeout:'readonly',clearTimeout:'readonly',setInterval:'readonly',clearInterval:'readonly',performance:'readonly',structuredClone:'readonly',Buffer:'readonly',Promise:'readonly'}},rules:{...js.configs.recommended.rules,'no-unused-vars':['error',{argsIgnorePattern:'^_'}]}}];
