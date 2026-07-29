import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: [
        resolve(__dirname, 'src/main/qrcode.ts'),
        resolve(__dirname, 'src/main/qrcode-gif.ts'),
        resolve(__dirname, 'src/main/qrcode-ascii.ts'),
        resolve(__dirname, 'src/main/qrcode-table.ts'),
        resolve(__dirname, 'src/main/qrcode-svg.ts'),
        resolve(__dirname, 'src/main/qrcode_SJIS.ts'),
        resolve(__dirname, 'src/main/qrcode_UTF8.ts')
      ],
      fileName: (format, entryName) =>
        format == 'cjs'? `${entryName}.js` :
        format == 'es'? `${entryName}.mjs` :
        `${entryName}.${format}.js`,
      formats: ['cjs', 'es'],
    },
    rollupOptions : { output : { exports : 'named' } }
  },
  plugins: [
    dts({
      rollupTypes : true,
    })
  ]
});
