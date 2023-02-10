/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import inject from "@rollup/plugin-inject";

export default defineConfig({
  plugins: [tsconfigPaths(), inject({
    XMLHttpRequest: ['xhr2', '*']
  })],
  server: {
    open: true,
    port: 3000,
  },
  test: {
    globals: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['cjs', 'es'],
    },
  },
})
