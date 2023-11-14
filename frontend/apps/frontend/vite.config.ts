/// <reference types='vitest' />
import path from 'path'
import {fileURLToPath} from 'url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/frontend',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@acme/counter': fileURLToPath(
        new URL('./../../libs/counter/src/index.ts', import.meta.url)
      ),
      '@mlc-ai/web-llm': fileURLToPath(
        new URL('./../../libs/web-llm/src/index.ts', import.meta.url)
      ),
    },
  },
  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [vue(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
