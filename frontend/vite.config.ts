/// <reference types='vitest' />
import path from 'path'
import {fileURLToPath} from 'url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import topLevelAwait from "vite-plugin-top-level-await";
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
  publicDir: 'static',
  cacheDir: '../../node_modules/.vite/frontend',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@mlc-ai/web-llm': fileURLToPath(
        new URL('./libs/web-llm/src/index.ts', import.meta.url)
      ),
    },
  },
  build: {
    target: 'es2020'
  },  
  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    vue(), 
    VitePWA({ 
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "Rust LLM",
        description: "LLM Chat Application",
        short_name: "LLM",
        icons: [
          {
            src: "logo.png",
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    })
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  optimizeDeps: {
    // exclude: ['@tensorflow/tfjs-backend-wasm']
  },
});
