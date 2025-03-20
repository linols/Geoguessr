import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Charger `.env` depuis le dossier parent `Geoguessr/`
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../'); // Charge les variables d'environnement

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      'import.meta.env.VITE_BACKEND_PORT': JSON.stringify(env.VITE_BACKEND_PORT ),
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
    },
  };
});
