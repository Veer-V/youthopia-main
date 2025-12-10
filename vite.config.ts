import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3001,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunks - separate large dependencies
            if (id.includes('node_modules')) {
              // React and related libraries
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              // Framer Motion (animation library, likely large)
              if (id.includes('framer-motion')) {
                return 'vendor-framer';
              }
              // Google GenAI
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }
              // Lucide icons
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // Other vendor dependencies
              return 'vendor-other';
            }

            // Application code chunks - split by feature area
            if (id.includes('/components/admin/')) {
              return 'admin';
            }
            if (id.includes('/components/executive/')) {
              return 'executive';
            }
            if (id.includes('/components/dashboard/')) {
              return 'dashboard';
            }
            if (id.includes('/components/')) {
              // Main components (AuthPage, LandingPage, etc.)
              return 'components';
            }
          }
        }
      },
      // Increase the chunk size warning limit to 1000 kB (optional)
      chunkSizeWarningLimit: 1000,
    }
  };
});
