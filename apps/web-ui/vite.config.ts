import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name(moduleId) {
                if (moduleId.includes('node_modules')) {
                  if (moduleId.includes('react-dom') || moduleId.includes('react-router') || moduleId.includes('/react/')) {
                    return 'vendor-react';
                  }
                  if (moduleId.includes('@mui/material') || moduleId.includes('@mui/icons-material') || moduleId.includes('@emotion')) {
                    return 'vendor-mui';
                  }
                  if (moduleId.includes('@reduxjs/toolkit') || moduleId.includes('react-redux')) {
                    return 'vendor-redux';
                  }
                  if (moduleId.includes('i18next')) {
                    return 'vendor-i18n';
                  }
                }
                return null;
              },
            },
          ],
        }
      },
    },
  },
});
