import { resolve } from 'path';

import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import handlebars from 'vite-plugin-handlebars';

import { customHmr } from './plugins/customHmr';
import previewHtml from './plugins/previewHtml';
import svgSprite from './plugins/svgSprite';
import convertImages from './plugins/imageConverter';
import generateMultiInputs from './plugins/multiInputs';
import generateLinkPages from './plugins/generateLinkPages';
import logCustomMessages from './plugins/logCustomMessages';
import cssInline from './plugins/cssInline';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'docs');

export default defineConfig({
  base: './',
  root,
  publicDir: '../public',
  build: {
    target: 'es2017',
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: generateMultiInputs(root)
    },
    assetsInlineLimit: 0
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://external-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  },
  plugins: [
    customHmr(),
    previewHtml(),
    cssInline({
      inline: false
    }),
    convertImages({
      imagePattern: 'src/img/**/*.{png,jpg}',
      convertWebp: true,
      convertAvif: true
    }),
    svgSprite({
      iconsDirectory: './src/img/icons',
      spriteFilePath: './src/img/sprite.svg'
    }),
    ViteMinifyPlugin({}),
    handlebars({
      partialDirectory: './src/partials'
    }),
    generateLinkPages({
      directoryPath: './src'
    }),
    logCustomMessages({
      messages: [
        `Index: http://localhost:${Number(process.env.EXPOSE_PORT)}/`,
        `Pages: http://localhost:${Number(process.env.EXPOSE_PORT)}/pages.html`
      ]
    }),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|webp|avif)$/i,
      png: {
        quality: 80
      },
      jpeg: {
        quality: 70
      },
      jpg: {
        quality: 70
      },
      webp: {
        quality: 70
      },
      avif: {
        quality: 70
      }
    })
  ]
});
