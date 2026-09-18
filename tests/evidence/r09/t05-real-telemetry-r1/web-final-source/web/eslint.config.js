import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';
export default [
 { ignores: ['.svelte-kit/**','build/**','node_modules/**','.cache/**','test-results/**','playwright-report/**'] },
 { files:['tests/server/*.mjs'], languageOptions:{globals:{document:'readonly',innerWidth:'readonly',devicePixelRatio:'readonly'}} },
 js.configs.recommended, ...ts.configs.recommended, ...svelte.configs['flat/recommended'],
 { languageOptions: { globals: { process:'readonly',console:'readonly',URL:'readonly',setTimeout:'readonly',clearTimeout:'readonly',fetch:'readonly',AbortController:'readonly',Response:'readonly',ReadableStream:'readonly',TextEncoder:'readonly',Buffer:'readonly',Promise:'readonly' } } },
 { files:['**/*.svelte'], languageOptions:{ globals:{sessionStorage:'readonly',localStorage:'readonly',window:'readonly',crypto:'readonly',AbortSignal:'readonly',HTMLDialogElement:'readonly',HTMLButtonElement:'readonly'}, parserOptions:{parser:ts.parser,svelteConfig} } }
];
