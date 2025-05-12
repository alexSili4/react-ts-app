import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': '/src',
      '@GeneralComponents': '/src/components/General',
      '@ErrorPageComponents': '/src/components/ErrorPage',
      '@MainPageComponents': '/src/components/MainPage',
      // animations
      '@AnimatedMainPageComponents': '/src/components/Animated/MainPage',
      '@AnimatedGeneralComponents': '/src/components/Animated/General',
    },
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name].js',
        entryFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || '';

          if (fileName.endsWith('.css')) {
            return 'css/[name][extname]';
          }

          if (fileName.endsWith('.ttf')) {
            return 'fonts/[name][extname]';
          }

          if (fileName.endsWith('.mp4')) {
            return 'video/[name][extname]';
          }

          if (fileName.endsWith('.jpg') || fileName.endsWith('.png')) {
            return 'images/[name][extname]';
          }

          return 'assets/[name][extname]';
        },
      },
    },
  },
});
