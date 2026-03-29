import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    // حجم chunk يظهر تحذير عنده (kb)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // تقسيم الكود لملفات أصغر = تحميل أسرع
        manualChunks: {
          // مكتبات React الأساسية في ملف واحد
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },

    // ضغط CSS
    cssMinify: true,

    // sourcemap فقط في التطوير
    sourcemap: false,
  },

  // تحسين التبعيات للتطوير (أسرع HMR)
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})