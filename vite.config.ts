import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lumeraBackendPlugin } from './server/vite-backend.plugin';

export default defineConfig({
  plugins: [react(), lumeraBackendPlugin()],
});
